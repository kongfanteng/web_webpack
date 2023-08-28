const path = require('path')

/**
 * Webpack 配置约束
 * @type {Config}
 * @typedef {Object} Config - Webpack 配置约束
 * @property {string} mode - development | production
 * @property {string | object} entry - default: './src/index.js'
 * @property {Output} output - default: { filename: 'bundle.js' }
 * @property {Module} module
 * @property {stirng[]} plugins
 *
 * @typedef {Object} Output
 * @property {string} filename
 * @property {string|undefined} path
 *
 * @typedef {Object} Module
 * @property {Rule[]} rules
 *
 * @typedef {object} Rule
 * @property {RegExp} test - 正则（匹配）
 * @property {['pre', 'post', 'normal']} [enforce] - 执行顺序控制: pre-先执行; post-后执行; normal-顺序执行（默认）;
 * @property {string|Use| string[]} use - 加载的 loader
 *
 * @typedef {object} Use
 * @property {string} loader - loader 名
 * @property {{presets: [ ['@babel/preset-env'], string[], string ]}} [options] - loader 配置项
 * */
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'loaders'),
    ],
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
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
      // {
      //   test: /\.(jpg|gif|png)$/,
      //   use: 'file-loader',
      // },
      {
        test: /\.(jpg|gif|png)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 20 * 1024,
          },
        },
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
}
