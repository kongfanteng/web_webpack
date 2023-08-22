# Webpack-JS-Eslint

## 1、eslint 应用

1. 手动配置
2. 直接初始化一个规范

- [eslint 官网 demo](https://eslint.org/demo)
- 安装 eslint `yarn add eslint eslint-loader`
- 配置 eslint 规则 [webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
{
  test: /\.js$/,
  use: {
    loader: 'eslint-loader',
  },
  enforce: 'pre', // 默认在编译 js 前校验
},
```

- 配置 eslint 配置文件两种：
  - 从 elint 官网下载 `.eslintrc.json`
  - 或者：`sudo npx eslint --init` 生成文件 [.eslintrc.js](./../../file/1_webpack/4_webpack_js/1_project/.eslintrc.js)
- devServer 增加代码校验层：[webpack.config.js](./../../file/1_webpack/4_webpack_js/1_project/webpack.config.js)

```js
devServer: {
  client: { // 增加代码校验层弹层
    overlay: true
  },
  port: 3000,
  open: true,
},
```

- 解决不支持装饰器报错：安装包 `yarn add babel-eslint`
- [.eslintrc.js](./../../file/1_webpack/4_webpack_js/1_project/.eslintrc.js)
  
```js
"parser": "babel-eslint",
```
