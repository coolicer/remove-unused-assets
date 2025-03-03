import * as fs from 'fs';
import * as path from 'path';

interface DynamicPathPattern {
  baseDir: string;
  pattern: string;
}

/**
 * 分析文件内容中的动态路径模式
 * @param content 文件内容
 * @returns 找到的动态路径模式列表
 */
function findDynamicPathPatterns(content: string): DynamicPathPattern[] {
  const patterns: DynamicPathPattern[] = [];

  // 匹配模板字符串中的路径模式
  const templateStringPattern = /`([^`]*\/[^`]*)\$\{[^}]+\}([^`]*)`/g;
  let match;

  while ((match = templateStringPattern.exec(content)) !== null) {
    const beforeDynamic = match[1]; // 动态部分之前的路径
    const afterDynamic = match[2]; // 动态部分之后的路径

    // 提取基础目录
    const baseDir = beforeDynamic.split('/').slice(0, -1).join('/');
    if (baseDir) {
      patterns.push({
        baseDir,
        pattern: `${beforeDynamic}*${afterDynamic}`,
      });
    }
  }

  // 匹配字符串拼接的路径模式
  const stringConcatPattern =
    /(["'])(.*\/.*?)\1\s*\+\s*[^"']+\s*\+\s*(["'])(.*?)\3/g;
  while ((match = stringConcatPattern.exec(content)) !== null) {
    const beforeDynamic = match[2]; // 动态部分之前的路径
    const afterDynamic = match[4]; // 动态部分之后的路径

    // 提取基础目录
    const baseDir = beforeDynamic.split('/').slice(0, -1).join('/');
    if (baseDir) {
      patterns.push({
        baseDir,
        pattern: `${beforeDynamic}*${afterDynamic}`,
      });
    }
  }

  return patterns;
}

/**
 * 在源代码文件中查找资源引用
 * @param sourceFiles 源代码文件列表
 * @param assetFiles 资源文件列表
 * @param baseDir 基础目录
 * @returns 引用列表
 */
export async function findReferencesInFiles(
  sourceFiles: string[],
  assetFiles: string[],
  baseDir: string
): Promise<string[]> {
  // 提取资源文件名和相对路径，用于在源代码中查找引用
  const assetReferences = assetFiles.map((file) => {
    const fileName = path.basename(file);
    const relativePath = path.relative(baseDir, file);
    return {
      file,
      fileName,
      relativePath,
      // 规范化路径分隔符，确保在不同操作系统上一致
      normalizedPath: relativePath.replace(/\\/g, '/'),
    };
  });

  // 存储找到的所有引用
  const references: string[] = [];
  // 存储可能被动态引用的目录
  const dynamicReferenceDirs = new Set<string>();

  // 遍历所有源代码文件
  for (const sourceFile of sourceFiles) {
    try {
      // 读取文件内容
      const content = await fs.promises.readFile(sourceFile, 'utf8');

      // 查找动态路径模式
      const dynamicPatterns = findDynamicPathPatterns(content);
      for (const pattern of dynamicPatterns) {
        dynamicReferenceDirs.add(pattern.baseDir);
      }

      // 检查每个资源的引用
      for (const asset of assetReferences) {
        // 检查文件名引用
        if (content.includes(asset.fileName)) {
          references.push(asset.fileName);
          continue;
        }

        // 检查相对路径引用
        if (
          content.includes(asset.relativePath) ||
          content.includes(asset.normalizedPath)
        ) {
          references.push(asset.relativePath);
          continue;
        }

        // 检查可能的URL路径引用（例如在CSS或HTML中）
        const urlPattern = `url\\(['"\]?[^)]*${asset.fileName}['"\]?\\)`;
        if (new RegExp(urlPattern).test(content)) {
          references.push(asset.fileName);
          continue;
        }

        // 检查可能的导入语句引用
        const importPattern = `(import|require)\\s*\\(['"\].*${asset.fileName}['"\]\\)`;
        if (new RegExp(importPattern).test(content)) {
          references.push(asset.fileName);
          continue;
        }

        // 检查微信小程序WXML中的图片引用
        const wxmlImagePattern = `<image[^>]*src=['"\]([^'"\]*${asset.fileName})['"]?[^>]*>`;
        if (new RegExp(wxmlImagePattern).test(content)) {
          references.push(asset.fileName);
          continue;
        }

        // 检查微信小程序WXSS中的背景图片引用
        const wxssBackgroundPattern = `background(-image)?:\\s*url\\(['"\]?[^)]*${asset.fileName}['"\]?\\)`;
        if (new RegExp(wxssBackgroundPattern).test(content)) {
          references.push(asset.fileName);
          continue;
        }

        // 检查资源是否在动态引用目录中
        for (const dir of dynamicReferenceDirs) {
          const normalizedAssetPath = asset.relativePath.replace(/\\/g, '/');
          if (normalizedAssetPath.startsWith(dir)) {
            references.push(asset.relativePath);
            break;
          }
        }
      }
    } catch (error) {
      console.error(`无法读取文件 ${sourceFile}:`, error);
    }
  }

  // 返回去重后的引用列表
  return [...new Set(references)];
}
