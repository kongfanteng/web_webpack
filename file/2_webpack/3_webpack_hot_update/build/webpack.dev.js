const webpack = require('webpack')

module.exports = {
  devServer: {
    client: { // 增加代码校验层弹层
      overlay: true,
    },
    port: 3000,
    open: true,
    hot: true, // 开启热更新（如果热更新失败，会强制刷新代码）
  },
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
}
