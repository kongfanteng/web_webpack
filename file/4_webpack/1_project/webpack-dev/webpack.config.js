const path = require('path')
const EmitPlugin = require('./plugins/EmitPlugin')
const DonePlugin = require('./plugins/DonePlugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, 'loaders', 'style-loader.js'),
          path.resolve(__dirname, 'loaders', 'less-loader.js'),
        ],
      },
    ],
  },
  plugins: [
    new DonePlugin(), // 一般情况，插件的顺序不一定，因为多个插件监听了同一个事件，谁在前谁执行
    new EmitPlugin(),
  ],
}
