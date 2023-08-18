
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // 忽略掉不要进行 loader 处理的文件
        include: path.resolve(__dirname, './src'),
        use: {
          loader: 'babel-loader', // .babelrc
          options: {
            presets: [['@babel/preset-env', {
              useBuiltIns: 'usage', // 只转化使用的 api
              corejs: { version: 3 }
            }]],
            plugins: [
              // ['@babel/plugin-transform-runtime', {
              // absoluteRuntime: false,
              // corejs: 3,
              // helpers: true,
              // regenerator: true,
              // useESModules: false,
              // }],
              ["@babel/plugin-proposal-decorators", {
                legacy: true
              }],
              ["@babel/plugin-proposal-class-properties", {
                loose: true
              }],
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin()
  ]
}