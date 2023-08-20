# Webpack-GlobalVar-暴露全局变量

## 1、暴露全局变量

- expose-loader
- externals
- ProvidePlugin

## 2、使用 script 引入 jquery，不需要打包 jquery

- 安装 jquery `yarn add jquery`
- [src/index.js](./../../file/2_webpack/1_webpack_global_var/src/index.js) 引入 jquery

```js
import $ from 'jquery'
console.log($)
console.log(window.$) // 很多库依赖全局的 jquery
```

- 通过在 [public/index.html](./../../file/2_webpack/1_webpack_global_var/public/index.html) 引入 [bootcdn](https://www.bootcdn.cn/jquery/) 链接，在打包时对 jquery 不进行打包，例如：`<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js"></script>`
- 定义外部的变量，配置 [webpack.config.js](./../../file/2_webpack/1_webpack_global_var/webpack.config.js)

```js
externals: {
  'jquery': '$', // 外部的变量，不需要打包
},
```

## 3、使用 Webpack 内置插件 ProvidePlugin 定义全局变量 $

- 配置 [webpack.config.js](./../../file/2_webpack/1_webpack_global_var/webpack.config.js)

```js
// externals: {
//   'jquery': '$', // 外部的变量，不需要打包
// },
plugins: [
  // ...
  new webpack.ProvidePlugin({
    $: 'jquery',
    'window.$': 'jquery',
    'window.jQuery': 'jquery',
    jQuery: 'jquery',
  }),
]
```

- [src/index.js](./../../file/2_webpack/1_webpack_global_var/src/index.js) 引入 jquery

```js
console.log('window.$:', window.$)
/* global $ */ // eslint 定义全局变量报错
console.log('$:', $)
```

## 4、使用 expose-loader 引入全局变量 jquery

- 安装 expose-loader：`yarn add expose-loader`
- 配置：[webpack.config.js](./../../file/2_webpack/1_webpack_global_var/webpack.config.js)

```js
{
  test: require.resolve('jquery'),
  use: {
    loader: 'expose-loader',
    options: {
      exposes: ['$', 'jQuery'],
    },
  },
},
```

- [src/index.js](./../../file/2_webpack/1_webpack_global_var/src/index.js)

```js
import $ from 'jquery'
console.log('window.$:', window.$)
console.log('$:', $)
```

### 内联引入 jquery

- [src/index.js](./../../file/2_webpack/1_webpack_global_var/src/index.js)

```js
// eslint-disable-next-line import/no-webpack-loader-syntax
require('expose-loader?exposes=$,jQuery!jquery')

console.log('window.$:', window.$)
/* global $ */
console.log('$:', $)

```
