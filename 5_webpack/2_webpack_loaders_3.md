# Webpack-Loaders-3

## 1、banner-loader-1

### 新建 banner-loader.js：[loaders/banner-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/banner-loader.js)

```js
function loader(source) {
  console.log('banner-loader')
  return source
}
module.exports = loader

```

### 配置：[webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js)

```js
{
  test: /\.js$/,
  use: {
    loader: 'banner-loader',
    options: {
      text: '/** make in 2023-08-28 by Mark **/',
    },
  },
},
```

### loader 配置：[loaders/banner-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/banner-loader.js)

```js
const loaderUtils = require('loader-utils')

function loader(source) {
  const options = loaderUtils.getOptions(this)
  console.log('options:', options) // options: { text: '/** make in 2023-08-28 by Mark **/' }
  // ...
}
```

- 安装 schema-utils: `sudo npm i schema-utils -D`, [文档](https://www.npmjs.com/package/schema-utils#API)

### loader 使用 schema-utils：[loaders/banner-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/banner-loader.js)

```js
const loaderUtils = require('loader-utils')
const schemaUtils = require('schema-utils')

function loader(source) {
  const options = loaderUtils.getOptions(this)
  const schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
    },
  }
  schemaUtils.validate(schema, options, 'banner-loader') // 验证格式正确
  return options.text + source
}
```

### 读取文件内容为打包后文件头部：[loaders/banner-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/banner-loader.js)

```js
if (options.filename) {
  return fs.readFileSync(options.filename, 'utf8') + source
}
return options.text + source
```

## 2、banner-loader-2

### 读取文件内容为打包后文件头部-配置项：[webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js)

```js
{
  test: /\.js$/,
  use: {
    loader: 'banner-loader',
    options: {
      text: '/** make in 2023-08-28 by Mark **/',
      filename: 'file_header.txt',
    },
  },
},
```

### 依赖的某个文件变化了，可以做到实时更新：[loaders/banner-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/banner-loader.js)

```js
this.cacheable(false)
// ...
if (options.filename) {
  // 希望如果依赖的某个文件变化了，可以做到实时更新
  this.addDependency(path.resolve(__dirname, '../', options.filename))
  return fs.readFileSync(options.filename, 'utf8') + source
}
return options.text + source
```

## 3、file-loader

### 1）引用图片：[src/index.js](./../file/4_webpack/3_project/webpack-loader/src/index.js)

```js
import logo from './wx.jpg';

const img = new Image()
img.src = logo
window.onload = () => {
  document.body.appendChild(img)
}
```

### 2）webpack 配置项[webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js)

```js
{
  test: /\.(jpg|gif|png)$/,
  use: 'file-loader',
},
```

### 3）新建 file-loader：[loaders/file-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/file-loader.js)

```js
function loader(source) {
  return source
}
module.exports = loader

```

- loader 处理二进制文件内容：[loaders/file-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/file-loader.js) > `loader.raw = true // loader 处理文件内容，文件内容是二进制`

### 4）loader 获取文件链接：[loaders/file-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/file-loader.js)

```js
const loaderUtils = require('loader-utils')

function loader(source) { // 默认 source 被 toString
  const fileUrl = loaderUtils.interpolateName(this, '[hash].[ext]', { content: source })
  // console.log('fileUrl:', fileUrl) // fileUrl: dd298798c1ba9bce12c464514c5ecd28.jpg
  this.emitFile(fileUrl, source)
  return `module.exports="${fileUrl}"`
}
loader.raw = true // loader 处理文件内容，文件内容是二进制
module.exports = loader

```

## 4、url-loader

### 1）webpack 配置 url-loader 项：[webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js)

```js
{
  test: /\.(jpg|gif|png)$/,
  use: {
    loader: 'url-loader',
    options: {
      limit: 20 * 1024,
    },
  },
},
```

- 安装 mime: `sudo npm i mime -D`

### 2）新建 url-loader.js: [loaders/url-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/url-loader.js)

```js
const loaderUtils = require('loader-utils')
const mime = require('mime')

function loader(source) { // 默认 source 被 toString
  const { limit } = loaderUtils.getOptions(this)
  if (limit > source.length) {
    // 转 base64
    const code = `data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}`
    return `module.exports = "${code}"`
  }
  return require('./file-loader').call(this, source)
}
loader.raw = true // loader 处理文件内容，文件内容是二进制
module.exports = loader

```

## 5、less-loader & style-loader

### 1）新建 less-loader.js: [loaders/less-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/less-loader.js), 安装 less-`sudo npm i less -D`

```js
const less = require('less')

function loader(source) {
  let css
  less.render(source, (err, result) => {
    css = result.css
  })
  return css
}
module.exports = loader

```

### 2）新建 style-loader.js: [loaders/style-loader.js](./../file/4_webpack/3_project/webpack-loader/loaders/style-loader.js)

```js
function loader(source) {
  const code = `
    let style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(style)
  `
  return code
}
module.exports = loader

```

- 新建 style.less: [src/style.less](./../file/4_webpack/3_project/webpack-loader/src/style.less) > `body { background: url('./wx.jpg')}`

### 3）webpack 配置 loader: [webpack.config.js](./../file/4_webpack/3_project/webpack-loader/webpack.config.js)

```js
{
  test: /\.less$/,
  use: ['style-loader', 'less-loader'],
},
```