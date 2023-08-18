# Webpack-Base-Webpack 基础

## 1、webpack-dev-server（Webpack 开发服务器）

### 安装-`yarn add webpack-dev-server`

- 执行-`npx webpack-dev-server`
- 配置 devServer [webpack.config.js](./../../file/1_webpack/1_webpack_base/4_webpack/webpack.config.js)

```js
devServer: {
  port: 3000, // 服务启动的端口号
  open: true, // 自动打开浏览器
  compress: true, // 启动 gzip 压缩
  static: './dist' // express.static(dist)
  // 默认打包的结果通过 webpack-dev-server 放在内存中，目录默认为当前 dist 目录，static 在启动一个静态文件目录
},
```