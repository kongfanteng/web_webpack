# Webpack-JS-TS

## 1、支持 ts 文件

- 新建 [src/test.ts](./../../file/1_webpack/4_webpack_js/2_project/src/test.ts)

```ts
export function sum(a: number, b: number): number {
  return a + b
}
```

- [src/index.js](./../../file/1_webpack/4_webpack_js/2_project/src/index.js) 引入 test.ts

```js
import sum from './test.ts'
console.log('sum(1, 23):', sum(1, 23))
```

- 安装依赖包 `yarn add typescript ts-loader`
- 规则定义：[webpack.config.js](./../../file/1_webpack/4_webpack_js/2_project/webpack.config.js)

```js
{
  test: /\.ts$/,
  use: 'ts-loader'
},
```

- typescript 初始化 `npx tsc --init`

- 解决 import 依赖报错 [.eslintrc.js](./../../file/1_webpack/4_webpack_js/2_project/.eslintrc.js)

```js
parserOptions: {
  ecmaVersion: 6,
  sourceType: 'module',
},
```