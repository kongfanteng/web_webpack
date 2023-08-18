const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
let htmlPlugins = ['index', 'other'].map(chunkName => new HtmlWebpackPlugin({ filename: `${chunkName}.html`, chunks: [chunkName] }))

module.exports = {
  mode: 'development', // 开发模式：开发（development）或生产（production）
  entry: './src/index.js', // 当前文件入口文件
  entry: {
    index: './src/index.js',
    other: './src/other.js',
  },
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...htmlPlugins
  ]
}