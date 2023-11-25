# 命令：
1. 本地调试: npm run start
2. 打包构建: npm run build

# Webpack 配置：
1. babel.config.js，关于 babel-loader 的配置，用来转换 js 代码兼容不同版本的浏览器，兼容浏览器配置见 .browserslistrc
2. postcss.config.js，关于 postcss 的配置，用来转换 css 代码，包括但不限于添加前缀、转换十六进制颜色值为rgba（如果颜色值包含透明度，比如#12345678，78就是透明度）
3. .browserslistrc，配置需要兼容的浏览器范围，可以在[浏览器范围代码检查](https://browsersl.ist/#q=%3E+0.1%25%0Alast+2+version%0Anot+dead%0A)输入配置信息涵盖的浏览器范围

**本地调试需要手动添加id参数：?id=64db6f657c05267c8a3ba915**