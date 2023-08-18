# Webpack-File_Img

## 1、url-loader（处理图片的 loader）

- 安装 url-loader => `yarn add file-loader url-loader`

- 示例：[src/index.js](./../../file/1_webpack/3_webpack_file_img/1_project/src/index.js)

```js
import url from './wx.jpg'
// file-loader 的作用，1、会帮你生成一个文件放到 dist 目录下；2、返回拷贝的路径
// url-loader 可以把小图片变成 base64 打包进去，例如 icon
let img = new Image()
img.src = url
document.body.appendChild(img)
```

- 配置：[webpack.config.js](./../../file/1_webpack/3_webpack_file_img/1_project/webpack.config.js)

```js
{
  test: /\.(jpg|png|gif)$/,
  use: 'file-loader',
},
```

### url-loader 使用

- [webpack.config.js](./../../file/1_webpack/3_webpack_file_img/1_project/webpack.config.js)

```js
{
  test: /\.(jpg|png|gif)$/,
  use: {
    loader: 'url-loader', // 如果图片小，会转成 base64，超过限制会打包出文件
    options: {
      limit: 20
    }
  }
},
```

- url-loader 配置项：[webpack.config.js](./../../file/1_webpack/3_webpack_file_img/1_project/webpack.config.js)

```js
{
  ...
  options: {
    limit: 20,
    publicPath: 'http://www.wo.com', // 增加访问前缀 http://www.wo.com/xxx.jpg
    outputPath: 'img', // 输出到某个文件夹中，默认输出 ./dist/img/xxx.jpg
  },
},

```

- options 配置项 ：[webpack.config.js](./../../file/1_webpack/3_webpack_file_img/1_project/webpack.config.js)

```js
{
  ...
  options: {
    publicPath: 'http://www.wo.com', // 为出口文件增加前缀，例如：http://www.wo.com/xxx/main.26d2aa98.js
    filename: '[name].js',
  },
  performance: false
},

```

## 2、icon 引入

- [src/index.js](./../../file/1_webpack/3_webpack_file_img/1_project/src/index.js)

```js
import './iconfont/iconfont.css'
let i = document.createElement('i')
i.className = 'iconfont icon-fangda'
document.body.appendChild(i)
```

### 配置 webpack

- TODO: Bug：file-loader 加载不出 iconfont 图标
- [webpack.config.js](./../../file/1_webpack/3_webpack_file_img/1_project/webpack.config.js)

```js
{
  test: /\.(eot|svg|ttf|woff|woff2)/,
  use: 'file-loader'
}
```

## 3、html-withimg-loader

### 安装 `yarn add html-withimg-loader` 

TODO: 调试未通过

- [webpack.config.js](./../../file/1_webpack/3_webpack_file_img/1_project/webpack.config.js)

```js
{
  test: /\.html/,
  use: 'html-withimg-loader'
}
```