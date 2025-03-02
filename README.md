# remove-unused-assets

[![NPM Version](https://img.shields.io/npm/v/remove-unused-assets.svg)](https://www.npmjs.com/package/remove-unused-assets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 说明

这是一个用于分析项目中未使用静态资源的工具，会分析出哪些静态资源没有被引用，并生成一个列表。

## 安装

### 全局安装

```bash
npm install -g remove-unused-assets
# 或者使用 yarn
yarn global add remove-unused-assets
# 或者使用 pnpm
pnpm add -g remove-unused-assets
```

### 项目内安装

```bash
npm install --save-dev remove-unused-assets
# 或者使用 yarn
yarn add --dev remove-unused-assets
# 或者使用 pnpm
pnpm add -D remove-unused-assets
```

## 使用方法

### 命令行使用

全局安装后，可以直接在任何项目目录下使用：

```bash
remove-unused-assets --dir ./src --pattern "**/*.{png,jpg,jpeg,gif,svg,ico}" --output unused-assets.txt
```

### 简写命令

```bash
remove-unused-assets -d ./src -p "**/*.{png,jpg}" -o unused-assets.txt
```

### 在项目中使用

在 package.json 中添加脚本：

```json
{
  "scripts": {
    "find-unused": "remove-unused-assets --dir ./src"
  }
}
```

然后运行：

```bash
npm run find-unused
```

## 参数说明

- `-d, --dir <directory>`: 指定要分析的目录，默认为当前目录 (.)
- `-p, --pattern <pattern>`: 静态资源文件匹配模式，默认为 `**/*.{png,jpg,jpeg,gif,svg,ico}`
- `-o, --output <file>`: 输出结果文件名，默认为 `unused-assets.txt`
- `-v, --version`: 显示版本号
- `-h, --help`: 显示帮助信息

## 示例

查看 [example](./example) 目录获取使用示例。

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 开源协议

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。
