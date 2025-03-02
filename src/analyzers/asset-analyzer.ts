import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
// 导入引用查找器工具
import { findReferencesInFiles } from '../utils/reference-finder';

interface AnalyzeOptions {
  directory: string;
  pattern: string;
  outputFile: string;
}

/**
 * 分析未使用的静态资源
 * @param options 分析选项
 * @returns 未使用的资源文件路径列表
 */
export async function analyzeUnusedAssets(
  options: AnalyzeOptions
): Promise<string[]> {
  const { directory, pattern, outputFile } = options;

  // 查找所有静态资源文件
  const assetFiles = await findAssetFiles(directory, pattern);

  // 查找所有可能引用资源的文件（代码文件）
  const sourceFiles = await findSourceFiles(directory);

  // 查找每个资源在源代码中的引用
  const unusedAssets = await findUnusedAssets(
    assetFiles,
    sourceFiles,
    directory
  );

  // 将结果写入输出文件
  await writeResultToFile(unusedAssets, outputFile);

  return unusedAssets;
}

/**
 * 查找所有匹配的静态资源文件
 */
async function findAssetFiles(
  directory: string,
  pattern: string
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, { cwd: directory, absolute: true }, (err: Error | null, files: string[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * 查找所有可能引用资源的源代码文件
 */
async function findSourceFiles(directory: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    // 查找常见的代码文件类型
    const pattern = '**/*.{js,jsx,ts,tsx,vue,html,css,scss,sass,less}';
    glob(pattern, { cwd: directory, absolute: true }, (err: Error | null, files: string[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}

/**
 * 查找未使用的资源文件
 */
async function findUnusedAssets(
  assetFiles: string[],
  sourceFiles: string[],
  baseDir: string
): Promise<string[]> {
  // 获取所有资源的引用情况
  const references = await findReferencesInFiles(
    sourceFiles,
    assetFiles,
    baseDir
  );

  // 筛选出未被引用的资源
  const unusedAssets = assetFiles.filter((assetFile) => {
    const assetName = path.basename(assetFile);
    const relativePath = path.relative(baseDir, assetFile);

    // 检查是否有任何引用
    return !references.some((ref) => {
      return ref.includes(assetName) || ref.includes(relativePath);
    });
  });

  // 返回相对路径
  return unusedAssets.map((file) => path.relative(baseDir, file));
}

/**
 * 将结果写入输出文件
 */
async function writeResultToFile(
  unusedAssets: string[],
  outputFile: string
): Promise<void> {
  const ext = path.extname(outputFile).toLowerCase();
  
  if (ext === '.txt') {
    // 为txt格式创建易读的输出
    const content = [
      `未使用资源统计报告`,
      `生成时间: ${new Date().toLocaleString()}`,
      `未使用资源总数: ${unusedAssets.length}`,
      `
未使用资源列表:`,
      ...unusedAssets
    ].join('\n');
    
    return fs.promises.writeFile(outputFile, content, 'utf8');
  } else {
    // 默认输出JSON格式
    const result = {
      timestamp: new Date().toISOString(),
      totalUnused: unusedAssets.length,
      unusedAssets,
    };

    return fs.promises.writeFile(
      outputFile,
      JSON.stringify(result, null, 2),
      'utf8'
    );
  }
}
