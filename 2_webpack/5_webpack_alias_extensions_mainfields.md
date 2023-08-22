# Webpack-Alias+Extensions+MainFields

## 1、alias

- [src/index.js](./../file/2_webpack/5_project/src/index.js)

```js
import Header from '_c/header'
```

- [webpack.config.js](./../file/2_webpack/5_project/webpack.config.js)

```js
resolve: {
  alias: {
    _c: path.resolve(__dirname, 'src', 'components'),
  },
},
```

- 解决： eslint不识别webpack alias,报错import/no-unresolved
  - 安装依赖 `yarn add eslint-import-resolver-alias`
  - [.eslintrc.js](./../file/2_webpack/5_project/.eslintrc.js)

  ```js
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['_c', './src/components'], // 别名路径
        ],
      },
    },
  },
  ```

## 2、Extensions-后缀列表

- [src/index.js](./../file/2_webpack/5_project/src/index.js)

```js
// ...
import './css'
```

- [src/css](./../file/2_webpack/5_project/src/css)

```js
body{
  background: red;
}
```

- [webpack.config.js](./../file/2_webpack/5_project/webpack.config.js)

```js
resolve: {
  // ...
  extensions: ['.js', '.css'], // 查找顺序，先找 js，再找 css
}
```

## 3、mainFields-结合 alias 代替 npm link 功能

- [webpack.config.js](./../file/2_webpack/5_project/webpack.config.js)

```js
resolve: {
  // ...
  // mainFiles: [], // 引入第三方模块 package.json -> main: index.js
  mainFields: ['style', 'main'], // 例如：`yarn add bootstrap@3` 默认调用 package.json 的 main，当前调用 style 的引用文件
}
```

- 安装 bootstrap `yarn add bootstrap@3`
- [src/index.js](./../file/2_webpack/5_project/src/index.js)

```js
import 'bootstrap'
```

## 4、mainfields 结合 alias 使用

- A 模块 package.json 新增 idebug 字段

```json
"browser": "dist/index.umd.js"
"idebug": "src/index.tsx"
```

- C 模块 webpack.config.js 更改 resolve 配置

```js
resolve: {
  alias: {
    "A$": path.resolve(__dirname, '../A/'),
  },
  mainFields: ['idebug', 'browser', 'module', 'main']
}
```

## 5、modules-第三方会先找自己的 node_modules

- [webpack.config.js](./../file/2_webpack/5_project/webpack.config.js)

```js
resolve: {
  // ...
  modules: [path.resolve(__dirname, 'node_modules')]
}
```