# Webpack-Env-配置文件

## 1、分离配置文件（开发、生产、基础），配置 env

- `--env xxx` 设置环境变量，来加载不同的配置文件
- 新建三个配置文件 [build/webpack.base.js](./../file/2_webpack/2_webpack_env/build/webpack.base.js) + [build/webpack.dev.js](./../file/2_webpack/2_webpack_env/build/webpack.dev.js) + [build/webpack.prod.js](./../file/2_webpack/2_webpack_env/build/webpack.prod.js)
- [build/webpack.dev.js](./../file/2_webpack/2_webpack_env/build/webpack.dev.js)

```js
module.exports = {
  devServer: {
    client: { // 增加代码校验层弹层
      overlay: true,
    },
    port: 3000,
    open: true,
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
}

```

- [build/webpack.prod.js](./../file/2_webpack/2_webpack_env/build/webpack.prod.js)

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const prodConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({}),
  ],
}
module.exports = prodConfig

```

- [package.json](./../file/2_webpack/2_webpack_env/package.json)

```js
"scripts": {
  "build": "webpack --env production --config build/webpack.base.js",
  "dev": "webpack-dev-server --env development --config build/webpack.base.js"
},
```

- 安装包 webpack-merge `yarn add webpack-merge -D`
- [build/webpack.base.js](./../file/2_webpack/2_webpack_env/build/webpack.base.js)

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')

const base = {
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      {
        test: require.resolve('jquery'),
        use: {
          loader: 'expose-loader',
          options: {
            exposes: ['$', 'jQuery'],
          },
        },
      },
      {
        test: /\.js$/,
        use: ['eslint-loader'],
        enforce: 'pre', // 默认在编译 js 前校验
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 忽略掉不要进行 loader 处理的文件
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader', // .babelrc
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'usage', // 只转化使用的 api
                  corejs: { version: 3 },
                },
              ],
            ],
            plugins: [
              [
                '@babel/plugin-proposal-decorators',
                {
                  legacy: true,
                },
              ],
              [
                '@babel/plugin-proposal-class-properties',
                {
                  loose: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
const dev = require('./webpack.dev')
const prod = require('./webpack.prod')

module.exports = (env) => {
  if (env.production) {
    return merge(base, prod)
  }
  return merge(base, dev)
}
```

- eslint 错误：import/no-extraneous-dependencies
- 解决：[.eslintrc.js](./../file/2_webpack/2_webpack_env/.eslintrc.js)

```js
settings: {
  'import/core-modules': ['html-webpack-plugin', 'clean-webpack-plugin', 'webpack-merge', 'mini-css-extract-plugin'],
},
```
