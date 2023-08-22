# Webpack-HotUpdate-热更新

## 1、热更新配置

- [build/webpack.dev.js](./../file/2_webpack/3_webpack_hot_update/build/webpack.dev.js)

```js
devServer: {
  // ...
  hot: true, // 开启热更新（如果热更新失败，会强制刷新代码）
},
plugins: [
  new webpack.HotModuleReplacementPlugin(),
],
```

- [src/other.js](./../file/2_webpack/3_webpack_hot_update/src/other.js)

```js
export default (a,b) => a + b
```

- [src/index.js](./../file/2_webpack/3_webpack_hot_update/src/index.js)

```js
import other from './other';

console.log('other(1, 2):', other(1, 2))
const btn = document.createElement('button')
btn.innerHTML = '点我啊'
btn.addEventListener('click', () => {
  const p = document.createElement('p')
  p.innerHTML = 'hello'
  window.app.appendChild(p)
})
window.app.appendChild(btn)
```

- [src/index.js](./../file/2_webpack/3_webpack_hot_update/src/index.js)

```js
if (module.hot) {
  // 重新干你想干的事
  // module.hot.accept(['./other'], fn)
  module.hot.accept('./other.js', () => {
    // eslint-disable-next-line global-require
    const sumx = require('./other').default
    btn.innerHTML = sumx(1, 2)
  })
}
```

## 2、lazy-load（懒加载）

- 点击按钮，去调用一个 js 文件
- [src/index.js](./../file/2_webpack/3_webpack_hot_update/src/index.js)

```js
const btn = document.createElement('button')
btn.innerHTML = '点我啊'
btn.addEventListener('click', async () => {
  const { default: o } = await import('./other')
  btn.innerHTML = o('a', 'b')
})
window.app.appendChild(btn)
```

### 点击按钮，jsonp 动态去加载 js 文件

- [src/index.js](./../file/2_webpack/3_webpack_hot_update/src/index.js)

```js
import('./other').then(({ default: o }) => {
  btn.innerHTML = o('b', 'c')
})
```

## 2、定义 other.js 为 video.js

- [src/index.js](./../file/2_webpack/3_webpack_hot_update/src/index.js)

```js
// npm run build ==> dist/video.xxx.js
import(/* webpackChunkName: "video" */'./other').then(({ default: o }) => {
  btn.innerHTML = o('b', 'c')
})
```

## 3、首页加载完毕后就开始下载异步模块

- [src/index.js](./../file/2_webpack/3_webpack_hot_update/src/index.js)

```js
import(/* webpackPrefetch: true */'./other').then(({ default: o }) => {
  btn.innerHTML = o('b', 'c')
})
```

- [import 模块方法说明](https://www.webpackjs.com/api/module-methods/#import)

## 4、source-map

- inline：内嵌 SourceMap 文件
- cheap：生成一个没有列信息（column-mappings）的 SourceMaps 文件，不包含 loader 的 sourcemap（譬如 babel 的 sourcemap）
- cheap-module：生成一个没有列信息（column-mappings）的 SourceMaps 文件，同时 loader 的 sourcemap 也被简化为只包含对应行的
- eval：每个 module 会封装到 eval 里包裹起来执行，并且会在末尾追加注释 // @sourceURL

> <https://webpack.docschina.org/configuration/devtool/>
> <https://www.cnblogs.com/wangyingblog/p/7027540.html>

- source-map 慢；eval 可以放到文件中，并且把文件变化成 eval 执行，cheap 精简

- [build/webpack.prod.js](./../file/2_webpack/3_webpack_hot_update/build/webpack.prod.js)

```js
// devtool: 'source-map',
// devtool: 'eval-source-map',
devtool: 'cheap-module-source-map',
```

- 开发环境推荐 eval-cheap-module-source-map
- 生产环境推荐 cheap-module-source-map
