const loaderUtils = require('loader-utils')

function loader(source) { // 默认 source 被 toString
  const fileUrl = loaderUtils.interpolateName(this, '[hash].[ext]', { content: source })
  // console.log('fileUrl:', fileUrl) // fileUrl: dd298798c1ba9bce12c464514c5ecd28.jpg
  this.emitFile(fileUrl, source)
  return `module.exports="${fileUrl}"`
}
loader.raw = true // loader 处理文件内容，文件内容是二进制
module.exports = loader
