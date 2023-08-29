const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SyncPlugin = require('./plugins/SyncPlugin')
const InlineSourcePlugin = require('./plugins/InlineSourcePlugin')

/**
 * Webpack 配置约束
 * @type {Config}
 * @typedef {Object} Config - Webpack 配置约束
 * @property {string} mode - development | production
 * @property {string | object} entry - default: './src/index.js'
 * @property {Output} output - default: { filename: 'bundle.js' }
 * @property {Module} [module]
 * @property {[stirng, HtmlWebpackPlugin][]} [plugins]
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
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new SyncPlugin({
      filename: 'r.md',
    }),
    new InlineSourcePlugin({
      match: /\.(js|css)$/,
    }),
  ],
}
