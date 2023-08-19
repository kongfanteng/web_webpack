# Webpack-Proxy

## 1、跨域 proxy

- webpack-dev-middleware
- proxy pathRewrite, secure, changeOrigin（http-proxy-middleware）
- before/after

## 2、xhr & express

- [src/test-xhr.js](./../../file/1_webpack/5_webpack_proxy/1_project/src/test-xhr.js)

```js
let xhr = new XMLHttpRequest()
xhr.open('get', '/user', true)
xhr.onload = function(){
  console.log(xhr.response, '----')
}
xhr.send()
```

- 安装 express `yarn add express`, [server.js](./../../file/1_webpack/5_webpack_proxy/1_project/server.js)

```js
let express = require('express')
let app = express()
app.get('/api/user', function(req, res) {
  res.json({name: 'kft'})
})
app.listen(4000)
```

- 配置代理-[webpack.config.js](./../../file/1_webpack/5_webpack_proxy/1_project/webpack.config.js)

```js
devServer: {
  ...
  proxy: {
    // '/user': 'http://localhost:4000'
    '/api': { // 跨域并重写路径
      target: 'http://localhost:4000',
      source: false, // 代理是否为 https 服务
      changeOrigin: true, // 主要是把 host 改写成访问的服务器地址
      pathRewrite: { '^/api': '' },
    },
  },
}
```

- 代理 http 监听函数 before：[webpack.config.js](./../../file/1_webpack/5_webpack_proxy/1_project/webpack.config.js)
- tips: 新版本 devServer 不支持

```js
devServer: {
  ...,
  before(app) {
    app.get('/api/user', function(req, res) {
      res.json({name: 'before'})
    })
  }
}
```

## 3、写服务，Webpack 跑在自己的服务上

- 安装依赖包 `yarn add webpack-dev-middleware`
- [server.js](./../../file/1_webpack/5_webpack_proxy/1_project/server.js)

```js
const webpack = require('webpack')
const config = require('./webpack.config')
const middleware = require('webpack-dev-middleware')
const compiler = webpack(config) // webpack-dev-middleware
// ...
app.use(middleware(compiler))
```