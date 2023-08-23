# Webpack-Treeshaking

## 1、DefinePlugin

### include/exclude

### treeshaking（只支持 es6 模块）

## 2、sideEffects-打包时清除未引用的代码

- [src/calc.js](./../file/3_webpack/1_project/src/calc.js)

```js
export const sum = () => 'a' + 'b'
export const minus = () => 'a-b'
```

- [src/index.js](./../file/3_webpack/1_project/src/index.js)

```js
import { sum } from './calc'
sum()
```

- [package.json](./../file/3_webpack/1_project/package.json)

```js
"sideEffects": false,
```

- [webpack.config.js](./../file/3_webpack/1_project/webpack.config.js)

```js
optimization: {
  sideEffects: true,
},
```

## 3、usedExports-去除副作用

- [webpack.config.js](./../file/3_webpack/1_project/webpack.config.js)

```js
mode: 'production',
optimization: {
  // sideEffects: true,
  usedExports: true,
},
```

## 4、scope hosting 作用域提升（只对生产环境生效）

- [src/index.js](./../file/3_webpack/1_project/src/index.js)

```js
// 只对生产环境生效，会干掉 a, b, c, d，打包为 `console.log("d:",6)`
const a = 1
const b = 2
const c = 3
const d = a + b + c
console.log('d:', d)
```

## 5、splitChunks（webpack 4 commonChunksPlugin）

- 安装依赖包 lodash jquery `yarn add lodash jquery`
- [src/index.js](./../file/3_webpack/1_project/src/index.js)

```js
import _ from 'lodash' // 提高加载速度，可以单独抽离出一个 js
let fn = _.after(1, function(){
  console.log('hello')
})
fn()
```

- [splitChunks 官网介绍](https://webpack.js.org/plugins/split-chunks-plugin/#optimizationsplitchunks)

- [webpack.config.js](./../file/3_webpack/1_project/webpack.config.js)

```js
optimization: {
  usedExports: true,
  splitChunks: {
    chunks: 'all',
    minSize: 0,
    minChunks: 1,
    cacheGroups: {
      vendor: {
        test: /node_modules/,
        filename: 'vendor.js',
        priority: 20,
      },
      default: {
        filename: 'common.js',
        minChunks: 1,
        priority: -20,
      },
    },
  },
},
```