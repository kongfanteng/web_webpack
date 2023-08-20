module.exports = {
  devServer: {
    client: { // 增加代码校验层弹层
      overlay: true,
    },
    port: 3000,
    open: true,
  },
  mode: 'development',
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
