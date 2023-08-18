# Webpack-CSSHandler-css_loader

## 1、css-loader & style-loader

### [src/index.js](./../../file/1_webpack/2_webpack_css/1_webpack//src/index.js)

```js
import './index.css'
import sum from './sum'
console.log('sum:', sum(1, 2))
```

### [src/index.css](./../../file/1_webpack/2_webpack_css/1_webpack//src/index.css) => `body{ background: red; }`

### 安装 css-loader style-loader => `yarn add css-loader style-loader`

### 配置 loader-[webpack.config.js](./../../file/1_webpack/2_webpack_css/1_webpack//webpack.config.js)

```js
module: {
  rules: [
    {
      test: /\.css$/,
      // loader 的顺序是从右向左，从下向上
      use: ['style-loader', 'css-loader'],
    },
  ]
}
```

### 增加前缀 cssmodule

- [src/index.js](./../../file/1_webpack/2_webpack_css/1_webpack//src/index.js)

```js
import './index.css'
let div = document.createElement('div')
div.innerHTML = 'HELLO'
div.className = 'hello'
div.className = 'cc'
document.body.appendChild(div)
```

- [webpack.config.js](./../../file/1_webpack/2_webpack_css/1_webpack//webpack.config.js)

```js
rules: [
  {
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      },
    ],
  },
]
```

### loader 分类

- 三类：前置 loader（pre）、后置 loader（post）、普通 loader（normal）
- [webpack.config.js](./../../file/1_webpack/2_webpack_css/1_webpack//webpack.config.js)
- use 可写成数组、对象、字符串的格式

```js
rules: [
  {
    test: /\.css$/,
    use: {
      laoder: 'css-loader',
      options: {
        modules: true,
      },
    },
  },
  {
    test: /\.css$/,
    use: 'style-loader',
    enforce: 'post',
  },
]
```

## 2、postcss-loader（autoprefixer）兼容各个浏览器

### 安装 `yarn add postcss-loader`

### 使用 [webpack.config.js](./../../file/1_webpack/2_webpack_css/1_webpack/webpack.config.js)

```js
rules: [
  {
    test: /\.css$/,
    use: ['style-loader', {
      loader: 'css-loader',
      options: {
        modules: true
      }
    }, 'post-loader']
  }
]
```

### 配置 postcss.config.js

- 安装 autoprefixer => `yarn add autoprefixer`

- [postcss.config.js](./../../file/1_webpack/2_webpack_css/1_webpack/postcss.config.js)

```js
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

## 3、less-loader

- [src/style.less](./../../file/1_webpack/2_webpack_css/1_webpack/src/style.less)

```css
body{
  div{
    color: blue
  }
}
```

- [src/index.css](./../../file/1_webpack/2_webpack_css/1_webpack/src/index.css)

```css
@import './style.less';
.cc{
  background: red;
}
```

- 安装 less less-loader => `yarn add less less-loader`

- [webpack.config.js](./../../file/1_webpack/2_webpack_css/1_webpack/webpack.config.js)

```js
test: /\.css$/,
use: [
  'style-loader',
  {
    loader: 'css-loader',
  },
  'less-loader',
  'postcss-loader',
]
```

## 4、scss-loader & stylus-loader

- 安装 node-sass sass-loader => `yarn add node-sass sass-loader`
- 安装 stylus stylus-loader => `yarn add stylus stylus-loader`
- 使用方式与 less-loader 一致

## 5、min-css-extract-plugin（css 抽离成文件）

- 安装 mini-css-extract-plugin => `yarn add mini-css-extract-plugin`

### 使用插件

- [webpack.config.js](./../../file/1_webpack/2_webpack_css/1_webpack/webpack.config.js)
- 需要去除 style-loader

```js
let MiniCssExtractPlugin = require('mini-css-extract-plugin')

use: [
  MiniCssExtractPlugin.loader,
  ...
]

plugins: [
  ...
  new MiniCssExtractPlugin({
    filename: 'main.css'
  })
]
```