const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserWebpackPlugin({})],
  },
  mode: 'development', // 开发模式：开发（development）或生产（production）
  devServer: {
    port: 3000, // 服务启动的端口号
    open: true, // 自动打开浏览器
    compress: true, // 启动 gzip 压缩
    static: './dist' // express.static(dist)
    // 默认打包的结果通过 webpack-dev-server 放在内存中，目录默认为当前 dist 目录，static 在启动一个静态文件目录
  },
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          {
            loader: 'css-loader',
          },
          'less-loader',
          'postcss-loader',
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), 
    new HtmlWebpackPlugin(),
    new OptimizeCssAssetsWebpackPlugin({}),
    new MiniCssExtractPlugin({
      filename: 'main.css'
    }),
  ],
}
