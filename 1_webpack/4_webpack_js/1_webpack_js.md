# Webpack-JS

## 1、ast 语法转化

- [src/index.js](./../../file/1_webpack/4_webpack_js/1_project/src/index.js)

```js
class Animal{
  constructor(type){
    this.type = type
  }
  getType(){
    return this.type
  }
}
let animal = new Animal('哺乳类')
console.log('animal.type:', animal.type)
```

- babel-loader -> @babel/core -> @babel/preset-env
- babel -> @babel/preset-env（es6 -> es5）
  
### 安装包 => `yarn add babel-loader @babel/core @babel/preset-env webpack webpack-cli html-webpack-plugin clean-webpack-plugin webpack-dev-server`

### 配置文件规则

- JS 转化规则：[webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/, // 忽略掉不要进行 loader 处理的文件
      include: path.resolve(__dirname, './src'),
      use: {
        loader: 'babel-loader', // .babelrc
        options: {
          presets: ['@babel/preset-env'],
          plugins: []
        }
      }
    }
  ]
}
```

- 其他配置项：[webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    // ...
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin()
  ]
}
```

## 2、相同方法复用

- 新建：[src/a.js](./../../file/1_webpack/4_webpack_js/1_project/src/a.js)，[src/index.js](./../../file/1_webpack/4_webpack_js/1_project/src/index.js) 引入 => `import a from './a'`

```js
class A {}
module.exports = A
```

- 打包后的 main.js 中 _classCallCheck 方法在两个文件重复进行了定义
- 解决：安装 `yarn add @babel/runtime @babel/plugin-transform-runtime`

- [webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
loader: 'babel-loader',
options: {
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-transform-runtime']
}
```

- `_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_0__` 取代了 `_classCallCheck` 方法，只定义了一次

## 3、@babel/preset-env 转换高版本 API

- 使用 @babel/preset-env 替换 @babel/runtime + @babel/pollyfill 进行重复方法转化
- [webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
options: {
  presets: [['@babel/preset-env', {
    useBuiltIns: 'usage', // 只转化使用的 api
  }]]
}
```

- 安装包：`yarn add core-js@3 -S`
- babel 转换高版本 API 语法
- [webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
options: {
  presets: [['@babel/preset-env', {
    useBuiltIns: 'usage', // 只转化使用的 api
    corejs: { version: 3 }
  }]]
}
```

- [src/index.js](./../../file/1_webpack/4_webpack_js/1_project/src/index.js)

```js
let P = new Promise((resolve, reject) => {})
```

- 转换了 Promise 为 `core_js_modules_es_promise_js__WEBPACK_IMPORTED_MODULE_6__`

## 4、使用 @babel/plugin-transform-runtime 转换高版本 API

- [webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
options: {
  presets: [['@babel/preset-env', {
    // useBuiltIns: 'usage', // 只转化使用的 api
    // corejs: { version: 3 }
  }]],
  plugins: [['@babel/plugin-transform-runtime', {
    absoluteRuntime: false,
    corejs: 3,
    helpers: true,
    regenerator: true,
    useESModules: false,
  }]]
}
```

- 目前并不支持实例上的方法
- 安装 `yarn add @babel/runtime-corejs3`

## 5、装饰器转化

- 安装包 `yarn add @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties`

- 引用 [webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
options: {
  presets: [['@babel/preset-env', {
    useBuiltIns: 'usage', // 只转化使用的 api
    corejs: { version: 3 }
  }]],
  plugins: [
    // ['@babel/plugin-transform-runtime', {
    // absoluteRuntime: false,
    // corejs: 3,
    // helpers: true,
    // regenerator: true,
    // useESModules: false,
    // }],
    ["@babel/plugin-proposal-decorators", {
      legacy: true
    }],
    ["@babel/plugin-proposal-class-properties", {
      loose: true
    }],
  ]
}
```

- 装饰器函数：[src/index.js](./../../file/1_webpack/4_webpack_js/1_project/src/index.js)

```js
@d
class Animal{
  // ...
}
function d(){
  console.log('装饰器')
}
```

- 无法转化实例上的方法 string.includes