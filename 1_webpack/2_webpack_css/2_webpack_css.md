# Webpack-CSSHandler-css_loader

## 1、optimize-css-assets-webpack-plugin 压缩 CSS & JS

### 安装包-`yarn add optimize-css-assets-webpack-plugin terser-webpack-plugin`

- [webpack.config.js](./../../file/1_webpack/2_webpack_css/1_webpack/webpack.config.js)

```js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

optimization: {
  minimize: true,
  minimizer: [new TerserWebpackPlugin()],
},
plugins: [
  ...,
  new OptimizeCssAssetsWebpackPlugin({}),
  ...
]

```