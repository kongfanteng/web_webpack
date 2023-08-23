# Webpack-ignorePlugin & happypack

## 1、ignorePlugin-忽略非引用依赖

- [src/index.js](./../file/3_webpack/2_project/src/index.js)

```js
import moment from 'moment';

moment.locale('zh-CN') // 需要忽略非汉语包
console.log('moment:', moment().format('MMMM Do YYYY, h:mm:ss a'))

```

- [webpack.config.js](./../file/3_webpack/2_project/webpack.config.js)

```js
plugins: [
  new webpack.IgnorePlugin({
    resourceRegExp: /\.\/locale/,
    contextRegExp: /moment/,
  }),
  // ...
]
```

- [src/index.js](./../file/3_webpack/2_project/src/index.js)

```js
import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-CN')
console.log('moment:', moment().format('MMMM Do YYYY, h:mm:ss a'))

```

## 2、happypack 使用（多线程打包，给定一个合适的线程数）

- 安装依赖包 `yarn add happypack`
- [webpack.config.js](./../file/3_webpack/2_project/webpack.config.js)

```js
const HappyPack = require('happypack')

plugins: [
  new HappyPack({
    id: 'js',
    threads: 4,
    loaders: ['babel-loader'], // babel-loader 版本最新版有问题-9.1.3，切到 8.0.0 正确
  }),
  new HappyPack({
    id: 'styles',
    threads: 4,
    loaders: ['style-loader', 'css-loader'],
  }),
],

rules: [
  {
    test: /\.js$/,
    use: 'happypack/loader?id=js',
  },
  {
    test: /\.css$/,
    use: 'happypack/loader?id=styles',
  },
],
```