const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const webpack = require('webpack')

module.exports = {
  // externals: {
  //   'jquery': '$', // 外部的变量，不需要打包
  // },
  devServer: {
    client: { // 增加代码校验层弹层
      overlay: true,
    },
    port: 3000,
    open: true,
  },
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      // {
      //   test: require.resolve('jquery'),
      //   use: {
      //     loader: 'expose-loader',
      //     options: {
      //       exposes: ['$', 'jQuery'],
      //     },
      //   },
      // },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.js$/,
        use: ['eslint-loader'],
        enforce: 'pre', // 默认在编译 js 前校验
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 忽略掉不要进行 loader 处理的文件
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader', // .babelrc
          options: {
            presets: [['@babel/preset-env', {
              useBuiltIns: 'usage', // 只转化使用的 api
              corejs: { version: 3 },
            }]],
            plugins: [
              ['@babel/plugin-proposal-decorators', {
                legacy: true,
              }],
              ['@babel/plugin-proposal-class-properties', {
                loose: true,
              }],
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
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   'window.$': 'jquery',
    //   'window.jQuery': 'jquery',
    //   jQuery: 'jquery',
    // }),
  ],
}