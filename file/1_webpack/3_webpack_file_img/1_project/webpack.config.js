const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

let HtmlPlugins = [
  'index'
].map(chunkName => {
  return new HtmlWebpackPlugin({
    filename: `${chunkName}.html`,
    chunks: [chunkName],
    template: `html-withimg-loader!${path.resolve(__dirname, './public/index.html')}`
  })
})

module.exports = {
  mode: 'development', // 开发模式：开发（development）或生产（production）
  devServer: {
    port: 3000, // 服务启动的端口号
    open: true, // 自动打开浏览器
  },
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(process.cwd(), 'dist'),
  },
  performance: false,
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: 'html-withimg-loader'
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader',
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader', // 如果图片小，会转成 base64，超过限制会打包出文件
          options: {
            limit: 20,
          },
        }
      },
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
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
    ...HtmlPlugins
  ],
}
