const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const HappyPack = require('happypack')

module.exports = {
  devServer: {
    open: true,
  },
  mode: 'production',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
  },
  plugins: [
    new HappyPack({
      id: 'jsx',
      threads: 4,
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      }],
    }),
    new HappyPack({
      id: 'styles',
      threads: 2,
      loaders: ['style-loader', 'css-loader'],
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /\.\/locale/,
      contextRegExp: /moment/,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
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
        use: 'happypack/loader?id=jsx',
        // exclude: /node_modules/,
        // include: path.resolve(__dirname, './src'),
      },
      {
        test: /\.css$/,
        use: 'happypack/loader?id=styles',
      },
      // {
      //   test: /\.js$/,
      //   use: 'babel-loader',
      //   exclude: /node_modules/,
      //   include: path.resolve(__dirname, './src'),
      // },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
    ],
  },
}
