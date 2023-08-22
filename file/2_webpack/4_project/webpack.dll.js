const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: {
    react: ['react', 'react-dom'],
  },
  output: {
    library: '[name]',
    filename: '[name].dll.js',
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, 'dist', '[name].manifest.json'),
      name: '[name]',
    }),
  ],
  // entry: {
  //   test: './src/test.js',
  // },
  // output: {
  //   // library: 'a',
  //   libraryTarget: 'this',
  //   filename: 'test.js',
  // },
}
