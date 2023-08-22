const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  devServer: {
    open: true,
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '@c': path.resolve(__dirname, 'src', 'components'),
    },
    extensions: ['.js', '.css'],
    // mainFiles: [], // 引入第三方模块 package.json -> main: index.js
    mainFields: ['style', 'main'], // 例如：`yarn add bootstrap@3` 默认调用 package.json 的 main，当前调用 style 的引用文件
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require.resolve('./dist/react.manifest.json'),
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('./dist/react.dll.js'),
      outputPath: '',
      publicPath: '',
      includeSourcemap: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['eslint-loader'],
        enforce: 'pre', // 默认在编译 js 前校验
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
        include: path.resolve(__dirname, './src'),
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
