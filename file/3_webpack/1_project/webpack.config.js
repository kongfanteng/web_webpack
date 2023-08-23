const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devServer: {
    open: true,
  },
  mode: 'development',
  // devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: '[name].js',
  },
  // optimization: {
  //   // sideEffects: true,
  //   usedExports: true,
  //   // minimizer: [],
  // },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      minChunks: 1,
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          filename: 'vendor.js',
        },
        default: {
          minChunks: 1,
          filename: 'common.js',
        },
      },
    },
  },
  plugins: [
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
