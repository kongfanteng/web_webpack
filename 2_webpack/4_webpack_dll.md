# Webpack-DllPlugin-动态链接库

## 1、Note

### dllPlugin

- dllPlugin
- referencePlugin
- add-asset-html-webpack-plugin

### resolve 参数

- extensions
- mainField/mainFiles
- alias

### 定义变量区分

- DefinePlugin

### include/exclude

### treeshaking

- usedExports: true
- sideEffects: false

### scope hosting

### ignorePlugin

### splitChunks

### happypack 使用

### 插件使用

- bannerWebpackPlugin
- copyWebpackPlugin

### tapable 使用

- SyncHook
- SyncBailHook 返回值不为 undefined 就停止
- SyncWaterfallHook 瀑布
- SyncLoopHook
- AsyncParalleHook tap tapAsync tapPromise/ call callAsync promise
- AsyncParallBailHook
- AsyncSeriesHook
- AsyncSeriesWaterfallHook

## 2、创建项目

- [webpack.config.js](./../file/2_webpack/4_project/webpack.config.js)
- 初始化 `yarn init -y`
- 依赖包 `yarn add webpack webpack-cli babel-loader @babel/core @babel/preset-env @babel/preset-react style-loader css-loader`
- 新建 [public/index.html](./../file/2_webpack/4_project/public/index.html)
- 配置 [webpack.config.js](./../file/2_webpack/4_project/webpack.config.js)
  
```js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['eslint-loader'],
        enforce: 'pre', // 默认在编译 js 前校验
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, './src')
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

- [.babelrc](./../file/2_webpack/4_project/.babelrc)

```js
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ]
}
```

- 安装 react 依赖包 `yarn add react react-dom -D`
- 安装本地开发服务依赖包和 HTML 依赖包 `yarn add webpack-dev-server html-webpack-plugin -D`
- 使用 html-webpack-plugin：[webpack.config.js](./../file/2_webpack/4_project/webpack.config.js)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

plugins: [
  new HtmlWebpackPlugin({
    template: './public/index.html',
  }),
],
```

- 启动命令 - [package.json](./../file/2_webpack/4_project/package.json)

```js
"scripts": {
  "dev": "webpack-dev-server",
  "build": "webpack"
},
```

- 入口文件调用 react 并使用 [src/index.js](./../file/2_webpack/4_project/src/index.js)

```js
import React from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('app'))
root.render('hello')
```

## 3、动态链接库

- 把一些模块打包好放在那，打包的时候只打包自己写的业务代码
- 在写一个配置文件，打包 React, ReactDOM 留着
- 动态链接库 dllPlugin

- 新建 dllPlugin 配置文件：[webpack.dll.js](./../file/2_webpack/4_project/webpack.dll.js)

```js
module.exports = {
  mode: 'development',
  entry: {
    // react: ['react', 'react-dom']
    test: './src/test.js',
  },
  output: {
    filename: 'test.js',
  },
}
```

- [src/test.js](./../file/2_webpack/4_project/src/test.js)
- 调试 `npx webpack --config webpack.dll.js`
- 添加变量 `var a = module`：[webpack.dll.js](./../file/2_webpack/4_project/webpack.dll.js)

```js
output: {
  library: 'a',
  // ...
},
```

- 使用规范设定 [webpack.dll.js](./../file/2_webpack/4_project/webpack.dll.js)

```js
output: {
  // ...
  // libraryTarget: 'this',
  libraryTarget: 'commonjs2',
},
```

- libraryTarget 倒出的用出 var
- library 给倒出的内容增加属性名

## 4、react 增加 dll

- [webpack.dll.js](./../file/2_webpack/4_project/webpack.dll.js)

```js
const webpack = require('webpack')
const path = require('path')

entry: {
  react: ['react', 'react-dom'],
},
output: {
  library: 'react',
  filename: '[name].dll.js',
},
plugins: [
  new webpack.DllPlugin({
    name: 'react',
    path: path.resolve(__dirname, 'dist', 'react.manifest.json')
  })
]
```

- 引用 dll 文件[webpack.dll.js](./../file/2_webpack/4_project/webpack.dll.js)

```js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom'],
  },
  output: {
    library: '[name]',
    filename: '[name].dll.js',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, 'dist', '[name].manifest.json'),
      name: '[name]',
    }),
  ],
}
```

## 5、添加资源插件 `add-asset-html-webpack-plugin`

- 安装依赖包 `yarn add add-asset-html-webpack-plugin`

- 配置 [webpack.config.js](./../file/2_webpack/4_project/webpack.config.js)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetsPlugin = require('add-asset-html-webpack-plugin')

plugins: [
  // ...
  new webpack.DllReferencePlugin({
    manifest: require.resolve('./dist/react.manifest.json'),
  }),
  new HtmlWebpackPlugin({
    template: './public/index.html',
  }),
  new AddAssetHtmlPlugin({
    filepath: require.resolve('./dist/react.dll.js'),
    outputPath: '',
    publicPath: '',
    includeSourcemap: true,
  }),
],
```

- [src/components/header.js](./../file/2_webpack/4_project/src/components/header.js)

```js
import React from 'react'

export default function(){
  return <h1>Hello</h1>
}
```
