const path = require('path')
module.exports = { // node mommonjs 规范
  entry: './src/a.js', // 当前入口文件的位置
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'a')
  }
}