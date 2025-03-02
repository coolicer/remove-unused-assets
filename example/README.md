# remove-unused-assets 示例项目

这是一个简单的示例项目，用于演示 remove-unused-assets 工具的使用方法。

## 项目结构

```
/example
  ├── src/
  │   ├── index.html      # 引用了 logo.png 和 banner.jpg
  │   └── styles.css      # 引用了 background.jpg
  ├── assets/
  │   ├── logo.png        # 被使用
  │   ├── banner.jpg      # 被使用
  │   ├── background.jpg  # 被使用
  │   ├── unused1.png     # 未使用
  │   └── unused2.svg     # 未使用
  └── README.md
```

## 使用方法

在项目根目录下运行：

```bash
npx remove-unused-assets -d example
```

工具将会分析并找出未使用的静态资源文件（unused1.png 和 unused2.svg）。