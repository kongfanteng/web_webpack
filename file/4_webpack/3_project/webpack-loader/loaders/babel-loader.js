const loaderUtils = require('loader-utils')
const babel = require('@babel/core')

function loader(source) {
  const options = loaderUtils.getOptions(this) // { presets: '@babel/preset-env' }
  const cb = this.async()
  babel.transform(source, {
    ...options,
    sourceMap: true, // 需要使用 sourceMap
    filename: this.resourcePath.split('/').pop(),
  }, (err, result) => { // loader 现在是一个异步 loader
    cb(err, result.code, result.map)
  })
  return source
}
module.exports = loader
