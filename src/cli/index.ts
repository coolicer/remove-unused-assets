#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { analyzeUnusedAssets } from '../analyzers/asset-analyzer';

const program = new Command();

program
  .version('1.0.0')
  .description('分析项目中未使用的静态资源')
  .option('-d, --dir <directory>', '指定要分析的目录', '.')
  .option(
    '-p, --pattern <pattern>',
    '静态资源文件匹配模式',
    '**/*.{png,jpg,jpeg,gif,svg,ico}'
  )
  .option('-o, --output <file>', '输出结果文件名', 'unused-assets.txt')
  .parse(process.argv);

const options = program.opts();

async function main(): Promise<void> {
  const spinner: Ora = ora('正在分析未使用的静态资源...').start();

  try {
    const unusedAssets = await analyzeUnusedAssets({
      directory: options.dir,
      pattern: options.pattern,
      outputFile: options.output,
    });

    spinner.succeed('分析完成！');
    console.log(
      chalk.green(`\n发现 ${unusedAssets.length} 个未使用的静态资源：`)
    );
    unusedAssets.forEach((asset) => {
      console.log(chalk.yellow(`- ${asset}`));
    });
    console.log(chalk.blue(`\n详细结果已保存到 ${options.output}`));
  } catch (error) {
    spinner.fail('分析过程中出现错误！');
    console.error(
      chalk.red(error instanceof Error ? error.message : String(error))
    );
    process.exit(1);
  }
}

main();
