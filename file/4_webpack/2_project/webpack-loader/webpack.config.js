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
 * @property {string|{loader: string}| string[]} use - 加载的 loader
 * */
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  resolve: {}, // module, alias, mainFiles
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'node_moudles'),
      path.resolve(__dirname, 'loaders'),
    ],
    // alias: {
    //   loader1: path.resolve(__dirname, 'loaders', 'loader1.js'),
    //   loader2: path.resolve(__dirname, 'loaders', 'loader2.js'),
    //   loader3: path.resolve(__dirname, 'loaders', 'loader3.js'),
    // },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'loader1',
        },
        enforce: 'pre',
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader2',
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'loader3',
        },
        enforce: 'post',
      },
    ],
  },
}
