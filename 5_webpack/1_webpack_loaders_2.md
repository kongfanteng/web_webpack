# Webpack-Loaders-2

## 1、解析 webpack 中 loader 方式三种

- 解析 webpack 中 loader 方式：resolveLoader-modules
- [webpack-loader/webpack.config.js](./../file/4_webpack/2_project/webpack-loader/webpack.config.js)

```js
resolveLoader: {
  modules: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(__dirname, 'loaders'),
  ],
},
```

- 解析 webpack 中 loader 方式三种
  1. 直接把编写的 loader 放到 node_modules 目录下
  2. resolveLoader-alias 或 resolveLoader-moudles
  3. rules 配置绝对路径

- [webpackx](./../file/4_webpack/2_project/webpackx)

```js

```

- [webpackx](./../file/4_webpack/2_project/webpackx)

```js

```

- [webpackx](./../file/4_webpack/2_project/webpackx)

```js

```

- [webpackx](./../file/4_webpack/2_project/webpackx)

```js

```

## 2、inline-loader

- 新建 inline-loader.js： [webpack-loader/loaders/inline-loader.js](./../file/4_webpack/2_project/webpack-loader/loaders/inline-loader.js)

```js
function loader(source) {
  console.log('inline-loader');
  return source
}
module.exports = loader

```

- 引用：inline-loader：[webpack-loader/src/index.js](./../file/4_webpack/2_project/webpack-loader/src/index.js) > `require('inline-loader!./a')`
- 新建 a.js：[webpack-loader/src/a.js](./../file/4_webpack/2_project/webpack-loader/src/a.js) > `console.log('a')`

- [webpack-loader/webpack.config.js](./../file/4_webpack/2_project/webpack-loader/webpack.config.js)

```js
const path = require('path')

/**
 * Webpack 配置约束
 * @type {Config}
 * @typedef {Object} Config - Webpack 配置约束
 * @property {string} mode - development | production
 * @property {string | object} entry - default: './src/index.js'
 * @property {Output} output - default: { filename: 'bundle.js' }
 * @property {Module} module
 * @property {stirng[]} plugins
 *
 * @typedef {Object} Output
 * @property {string} filename
 * @property {string|undefined} path
 *
 * @typedef {Object} Module
 * @property {Rule[]} rules
 *
 * @typedef {object} Rule
 * @property {RegExp} test - 正则（匹配）
 * @property {['pre', 'post', 'normal']} [enforce] - 执行顺序控制: pre-先执行; post-后执行; normal-顺序执行（默认）;
 * @property {string|{loader: string}| string[]} use - 加载的 loader
 * */
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  resolve: {}, // module, alias, mainFiles
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'loaders'),
    ],
    // alias: {
    //   loader1: path.resolve(__dirname, 'loaders', 'loader1.js'),
    //   loader2: path.resolve(__dirname, 'loaders', 'loader2.js'),
    //   loader3: path.resolve(__dirname, 'loaders', 'loader3.js'),
    // },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'loader1',
        },
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader2',
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader3',
        },
        enforce: 'post',
      },
    ],
  },
}

```

- rules: webpack 内部设置了一个数组，存放 loader
- `!!`：对经常使用 inline-loader 且不希望其他 loader 处理：[webpack-loader/src/index.js](./../file/4_webpack/2_project/webpack-loader/src/index.js)

```js
require('!!inline-loader!./a')
// 打印：
// loader3-pitch
// loader2-pitch
// loader1-pitch
// 1
// 2
// 3
// inline-loader

```

- `-!`：不要执行当前 inline-loader 前的 loader：[webpack-loader/src/index.js](./../file/4_webpack/2_project/webpack-loader/src/index.js)

```js
require('-!inline-loader!./a')
// 打印：
// loader3-pitch
// loader2-pitch
// loader1-pitch
// 1
// 2
// 3
// loader3-pitch
// inline-loader
// 3
```

## 3、inline-loader

- `!`：normalLoader（enforce 为 normal） 不执行，[webpack-loader/src/index.js](./../file/4_webpack/2_project/webpack-loader/src/index.js)

```js
require('!inline-loader!./a')
// 打印：
// loader3-pitch
// loader2-pitch
// loader1-pitch
// 1
// 2
// 3
// loader3-pitch
// loader1-pitch
// 1
// inline-loader
// 3

```

## 4、babel-loader 自定义-1

- 新建 webpack.config.js-[webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js)
- 新建 babel-loader.js-[loaders/babel-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/babel-loader.js)
- 安装 babel 依赖 `sudo npm i @babel/core @babel/preset-env -D`
- babel 配置：[webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js)

```js
module: {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: '@babel/preset-env',
        },
      },
    },
  ],
},
```

- 自定义 babel-loader：[loaders/babel-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/babel-loader.js)

```js
function loader(source) {
  console.log(Object.keys(this)); // 当前 loader 上下文; this.query: { presets: '@babel/preset-env' }
  /* [
    'version',                'getOptions',
    'emitWarning',            'emitError',
    'getLogger',              'resolve',
    'getResolve',             'emitFile',
    'addBuildDependency',     'utils',
    'rootContext',            'webpack',
    'sourceMap',              'mode',
    '_module',                '_compilation',
    '_compiler',              'fs',
    'target',                 'environment',
    'loadModule',             'importModule',
    'context',                'loaderIndex',
    'loaders',                'resourcePath',
    'resourceQuery',          'resourceFragment',
    'async',                  'callback',
    'cacheable',              'addDependency',
    'dependency',             'addContextDependency',
    'addMissingDependency',   'getDependencies',
    'getContextDependencies', 'getMissingDependencies',
    'clearDependencies',      'resource',
    'request',                'remainingRequest',
    'currentRequest',         'previousRequest',
    'query',                  'data'
  ] */
  return source
}
module.exports = loader

```

- 安装 loader 工具库 loader-utils, `sudo npm i loader-utils@1.4.2 -D`，[loader-utils 文档](https://github.com/webpack/loader-utils)
- 使用 loader-utils：[loaders/babel-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/babel-loader.js)

```js
const loaderUtils = require('loader-utils')

function loader(source) {
  const options = loaderUtils.getOptions(this)
  console.log('options:', options) // options: { presets: '@babel/preset-env' }
  return source
}
module.exports = loader

```

- loader 有两种方式：一种同步，同步可以直接返回；另一种是异步，可以传递多个参数；
- babel-loader 内部逻辑：[loaders/babel-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/babel-loader.js)

```js
const loaderUtils = require('loader-utils')
const babel = require('@babel/core')

function loader(source) {
  const options = loaderUtils.getOptions(this) // { presets: '@babel/preset-env' }
  const cb = this.async()
  babel.transform(source, {
    ...options,
    sourceMap: true, // 需要使用 sourceMap
  }, (err, result) => { // loader 现在是一个异步 loader
    // 第一个参数是错误信息：NonErrorEmittedError: (Emitted value instead of an instance of Error) 123
    // cb(123)
    console.log(Object.keys(result))
    /* [
      'metadata',
      'options',
      'ast',
      'code',
      'map',
      'sourceType',
      'externalDependencies'
    ] */
    cb(err, result.code, result.map)
  })
  return source
}
module.exports = loader

```

- [webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js) > `mode: 'development', devtool: 'source-map',`
- 类打包：[src/index.js](./../file/4_webpack/3_project/webpack-loader/src/index.js)

```js
class A {

}
const a = new A()
a.getName()
// 打包后浏览器中使用报错
// a.getName is not a function, src/index.js （unkown: 16），需要对 unkown 进行处理

```

## 5、babel-loader 自定义-2

- 对 unkown 进行处理：[loaders/babel-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/babel-loader.js)

```js
sourceMap: true, // 需要使用 sourceMap
filename: this.resourcePath.split('/').pop(),
```