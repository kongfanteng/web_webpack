# Webpack-Base-Webpack 基础

## 1、html-webpack-plugin 根据模块产生一个打包后的 HTML

### 安装包： `yarn add webpack webpack-cli html-webpack-plugin`

### 使用包：[webpack.config.js](./../../file/1_webpack/1_webpack_base/2_webpack/webpack.config.js)

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js', // 当前文件入口文件
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'a')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filenmae: 'login.html'
    })
  ]
}
```

### [增加配置项](./../../file/1_webpack/1_webpack_base/2_webpack/webpack.config.js)

```js
minify: {
  removeAttributeQuotes: true, // 去除 HTML 文件中引号
  collapseWhitespace: true // 去除空格
}
```

## 2、Webpack 学习流程

### 1）Webpack 核心配置（loader 和 plugin 看文档、GitHub、npm）

### 2）优化 Webpack 配置

### 3）ast 语法树 es6 -> es5

### 4）tapable 库（管理代码流程的）（实现钩子）

### 5）自己实现一版 Webpack（加入 loader 和 plugin）

### 7）实现 loader 和 plugin（写常见的 loader 和 plugin）

## 3、Webpack 核心配置

### 核心、入口、出口、loader、plugin

### Webpack 安装 webpack/webpack-cli （不要安装到全局）

### npx 运行和脚本运行

### 模块化 commonjs/esModule（混用问题）

### 默认的配置文件 webpack.config.js

### 入口和出口的配置

### html-webpack-plugin 配置，多入口配置

### [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)（cleanOnceBeforeBuildPatterns）

## 4、[webpack 核心配置代码](./../../file/1_webpack/1_webpack_base/3_webpack/webpack.config.js)

### [src/sum.js](./../../file/1_webpack/1_webpack_base/3_webpack/src/sum.js) => `export default (a, b) => a + b`

### [package.json](./../../file/1_webpack/1_webpack_base/3_webpack/package.json) => `"build": "webpack"`

### [src/index.js](./../../file/1_webpack/1_webpack_base/3_webpack/src/index.js) => `import sum from './sum'; console.log(sum('a', 'b'))`

- 尽量不要把 require 和 import 混用
- import 只能放到页面的最顶上

### [webpack.config.js](./../../file/1_webpack/1_webpack_base/3_webpack/webpack.config.js)

```js
module.exports = {
  mode: 'development', // 开发模式：开发（development）或生产（production）
  entry: './src/index.js', // 当前文件入口文件
  output: {
    filename: 'bundle.js'
  }
}
```

### 增加 html-webpack-plugin：[webpack.config.js](./../../file/1_webpack/1_webpack_base/3_webpack/webpack.config.js)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin()
]
```

- webpack 插件，相当于 vue 的钩子函数
- 通过插件来实现自己的功能，在钩子函数上订阅一些事情
- 例如 html-webpack-plugin

## 5、clean-webpack-plugin（清理文件的插件） 使用

### 安装包 `yarn add clean-webpack-plugin`

### 配置 [webpack.config.js](./../../file/1_webpack/1_webpack_base/3_webpack/webpack.config.js)

```js
const path = require('path')
let { CleanWebpackPlugin } = require('clean-webpack-plugin')

output: {
  filename: '[name].[contenthash:8].js',
  path: path.resolve(process.cwd(), 'dist'),
},
plugins: [
  new CleanWebpackPlugin({
    cleanOnceBeforeBuildPatterns: ['**/*']
  })
]
```

### 多入口打包-[webpack.config.js](./../../file/1_webpack/1_webpack_base/3_webpack/webpack.config.js)

- [src/other.js](./../../file/1_webpack/1_webpack_base/3_webpack/src/other.js)

```js
let htmlPlugins = ['index.html', 'other.html'].map(filename => new HtmlWebpackPlugin({ filename }))

entry: {
  index: './src/index.js',
  other: './src/other.js',
},
output: {
  filename: '[name].[contenthash:8].js'
},
plugins: [
  ...htmlPlugins
]
```

#### HtmlWebpackPlugin 参数配置

- [webpack.config.js](./../../file/1_webpack/1_webpack_base/3_webpack/webpack.config.js)

```js
let htmlPlugins = ['index', 'other'].map(chunkName => new HtmlWebpackPlugin({ filename: `${chunkName}.html`, chunks: [chunkName] }))
```