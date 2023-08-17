# Webpack-Base-Webpack 基础

## 1、什么是 Webpack

### Webpack 可以看做是模块打包机：它做的事情是，分析你的项目结构，找到 JavaScript 模块以及其它一些浏览器不能直接运行的拓展语言（Scss，Typescript 等），并将其打包为合适的格式以供浏览器使用

## 2、常见的模块打包机：旧（gulp、gult、sea.js）、新（rollup、pacel、Webpack）

## 3、构建就是把源代码转换成发布到线上的可执行 JavaScript、CSS、HTML 代码，包括如下内容

### 代码转换：TypeScript 编译成 JavaScript、SCSS 编译成 CSS 等

### 文件优化：压缩 JavaScript、CSS、HTML 代码，压缩合并图片等

### 代码分割：提取多个页面的公共代码、提取首屏不需要执行部分的代码让其异步加载

### 模块合并：在采用模块化的项目里会有很多个模块和文件，需要构建功能把模块分类合并成一个文件

### 自动刷新：监听本地源代码的变化，自动重新构建、刷新浏览器

### 代码校验：在代码被提交到仓库前需要校验代码是否符合规范，以及单元测试是否通过

### 自动发布：更新完代码后，自动构建出线上发布代码并传输给发布系统

构建其实是工程化、自动化思想在前端开发中的体现，把一系列流程用代码去实现，让代码自动化地执行这一系列复杂的流程。构建给前端开发注入了更大的活力，解放了我们的生产力

## 4、使用 Webpack 构建

版本一致，本地安装 --save-dev 或 -D

### 1）初始化项目

```node
# 初始化项目
npm init -y
# 安装 webpack 包
sudo npm install webpack webpack-cli -D
```

### 2）[package.json](./../../file/1_webpack/1_webpack_base/1_webpack/package.json)

```js
"scripts": {
  "build": "webpack"
}
```

#### 执行 `npm run build -- --mode development`

#### 创建 [index.js](./../../file/1_webpack/1_webpack_base/1_webpack/src/index.js) => `console.log('hello')`, 执行构建命令，在 dist/main.js 打印，结果：hello

#### 创建 [sum.js](./../../file/1_webpack/1_webpack_base/1_webpack/src/sum.js) => `module.exports = (a,b) => a + b`

#### [index.js](./../../file/1_webpack/1_webpack_base/1_webpack/src/index.js) 引入 sum.js `let sum = require('./sum'); console.log(sum(1, 2));` , 执行构建命令，在 dist/main.js 打印，结果：3

#### 复制打包后的 dist/main.js 文件，删掉注释，复制为 [1_main.js](./../../file/1_webpack/1_webpack_base/1_webpack/1_main.js)

## 5、Webpack 打包流程

### 1）找到入口的文件 index.js 为例

### 2）找到 index.js 中引用了哪些模块，会加载 sum 模块，ast

### 3）index 是入口，执行的时候，默认会从入口执行，rquire 方法改写成 __webpack_require__

- （需要找到入口，需要找到入口中的所有依赖，加载依赖） + 模板 => 渲染后的结果

- 自己实现一个 commonjs 模块

## 6、新建 [webpack.config.js](./../../file/1_webpack/1_webpack_base/1_webpack/webpack.config.js) 和 [src/a.js](./../../file/1_webpack/1_webpack_base/1_webpack/src/a.js) => `console.log('a')`

```js
module.exports = { // node mommonjs 规范
  entry: './src/a.js' // 当前入口文件的位置
}
```

### 1）构建命令 `npm run build -- --mode development --config webpack.config.js`

### 2）出口文件配置 [webpack.config.js](./../../file/1_webpack/1_webpack_base/1_webpack/webpack.config.js)

```js
const path = require('path')

output: {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'a')
}
```

- 默认 Webpack 的配置文件 webpack.config.js
- 执行构建命令后出口文件地址为 [a/bundle.js](./../../file/1_webpack/1_webpack_base/1_webpack/a/bundle.js)
