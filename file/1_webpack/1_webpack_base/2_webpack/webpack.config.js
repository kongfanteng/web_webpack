const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: './src/index.js', // 当前文件入口文件
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'a')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeAttributeQuotes: true, // 去除 HTML 文件中引号
        collapseWhitespace: true // 去除空格
      },
      filenmae: 'login.html'
    })
  ]
}