# remove-unused-assets

[![NPM Version](https://img.shields.io/npm/v/remove-unused-assets.svg)](https://www.npmjs.com/package/remove-unused-assets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 说明

这是一个用于分析项目中未使用静态资源的工具，会分析出哪些静态资源没有被引用，并生成一个列表。支持常规 Web 项目和微信小程序项目。

### 特性

- 支持分析静态资源引用
- 支持动态路径分析（如模板字符串和变量拼接）
- 支持微信小程序项目
- 生成详细的分析报告

### 动态路径支持

工具现在可以识别以下类型的动态路径：

1. 模板字符串：`` `path/to/img/pic_${index}.png` ``
2. 字符串拼接：`'path/to/img/pic_' + index + '.png'`

当检测到动态路径时，工具会分析路径的基础目录（如 `path/to/img/`），并将该目录下的所有匹配文件标记为"可能被使用"，以避免误报。

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
remove-unused-assets --dir ./src --pattern "**/*.{png,jpg,jpeg,gif,svg,ico}"
```

### 简写命令

```bash
remove-unused-assets -d ./src -p "**/*.{png,jpg}"
```

### 微信小程序项目

对于微信小程序项目，可以使用 `-w` 或 `--wechat` 参数启用微信小程序模式：

```bash
remove-unused-assets -d ./miniprogram -p "**/*.{png,jpg,jpeg,gif,svg}" -w
```

微信小程序模式下，工具会额外检查 WXML 中的图片引用（如 `<image src="...">` 标签）和 WXSS 中的背景图片引用。

### 在项目中使用

在 package.json 中添加脚本：

```json
{
  "scripts": {
    "find-unused": "remove-unused-assets --dir ./src",
    "find-unused-wxapp": "remove-unused-assets --dir ./miniprogram --wechat"
  }
}
```

然后运行：

```bash
npm run find-unused
# 或者微信小程序项目
npm run find-unused-wxapp
```

## 参数说明

- `-d, --dir <directory>`: 指定要分析的目录，默认为当前目录 (.)
- `-p, --pattern <pattern>`: 静态资源文件匹配模式，默认为 `**/*.{png,jpg,jpeg,gif,svg,ico}`
- `-o, --output <file>`: 输出结果文件名，默认为 `unused-assets.txt`
- `-w, --wechat`: 启用微信小程序模式，会检查 WXML 和 WXSS 中的资源引用
- `-v, --version`: 显示版本号
- `-h, --help`: 显示帮助信息

## 支持的文件类型

- 源代码文件：js, jsx, ts, tsx, vue, html, css, scss, sass, less
- 微信小程序文件：wxml, wxss, json
- 静态资源文件：png, jpg, jpeg, gif, svg, ico 等（可通过 pattern 参数自定义）

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

```

```
