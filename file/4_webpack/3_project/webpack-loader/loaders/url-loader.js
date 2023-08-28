const loaderUtils = require('loader-utils')
const mime = require('mime')

function loader(source) { // 默认 source 被 toString
  const { limit } = loaderUtils.getOptions(this)
  if (limit > source.length) {
    // 转 base64
    const code = `data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}`
    return `module.exports = "${code}"`
  }
  return require('./file-loader').call(this, source)
}
loader.raw = true // loader 处理文件内容，文件内容是二进制
module.exports = loader
