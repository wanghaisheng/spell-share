const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    index: "./index.js",
  },
  optimization: {
    // 有多个入口是需要配置此选项，否则会报错
    // runtimeChunk: 'single',

    // 去除重复的引用，比如A文件引入了lodash, B文件也引入了lodash
    // 默认情况下，这两个文件打包后的代码都包含了lodash的源代码，
    // 所以要加这个配置把 lodash 独立到一个文件中
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    // 用于输出 html 文件，自动引入 js 文件
    new HtmlWebpackPlugin({
      template: "./index.html",
      // favicon: path.resolve("./images/logo.png"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  // 包含了autoprefix-自动加上浏览器兼容前缀，
                  // 对于十六进制颜色值#12345678，后面的78代表透明度，不是所有浏览器都支持，这个插件就可以将其转成rgba的格式
                  "postcss-preset-env", //缩写，全拼是 require("postcss-preset-env"),
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset", // asset/resource、asset/inline、asset/source、asset 四种类型
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024, // 图片小于4kb，就转成base64
          },
        },
        generator: {
          filename: "./imgs/[hash:10][ext]", // 指定输出目录和文件名,[hash:10]表示取哈希值的前10位，[ext]文件格式为原格式
        },
      },
      // 需要通过html-loader解析html文件，img标签才能被内置资源模块处理
      {
        test: /\.html$/,
        loader: "html-loader",
      },
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
};
