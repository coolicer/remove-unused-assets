import * as fs from 'fs';
import * as path from 'path';

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
  const assetReferences = assetFiles.map(file => {
    const fileName = path.basename(file);
    const relativePath = path.relative(baseDir, file);
    return {
      file,
      fileName,
      relativePath,
      // 规范化路径分隔符，确保在不同操作系统上一致
      normalizedPath: relativePath.replace(/\\/g, '/')
    };
  });

  // 存储找到的所有引用
  const references: string[] = [];

  // 遍历所有源代码文件
  for (const sourceFile of sourceFiles) {
    try {
      // 读取文件内容
      const content = await fs.promises.readFile(sourceFile, 'utf8');
      
      // 检查每个资源的引用
      for (const asset of assetReferences) {
        // 检查文件名引用
        if (content.includes(asset.fileName)) {
          references.push(asset.fileName);
        }
        
        // 检查相对路径引用
        if (content.includes(asset.relativePath) || content.includes(asset.normalizedPath)) {
          references.push(asset.relativePath);
        }
        
        // 检查可能的URL路径引用（例如在CSS或HTML中）
        const urlPattern = `url\(['"]?[^)]*${asset.fileName}['"]?\)`;
        if (new RegExp(urlPattern).test(content)) {
          references.push(asset.fileName);
        }
        
        // 检查可能的导入语句引用
        const importPattern = `(import|require)\s*\(['"].*${asset.fileName}['"]\)`;
        if (new RegExp(importPattern).test(content)) {
          references.push(asset.fileName);
        }
      }
    } catch (error) {
      console.error(`无法读取文件 ${sourceFile}:`, error);
    }
  }

  // 返回去重后的引用列表
  return [...new Set(references)];
}