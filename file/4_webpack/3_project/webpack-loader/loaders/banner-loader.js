const loaderUtils = require('loader-utils')
const schemaUtils = require('schema-utils')
const fs = require('fs')
const path = require('path')

function loader(source) {
  this.cacheable(false)
  const options = loaderUtils.getOptions(this)
  const schema = {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
    },
  }
  schemaUtils.validate(schema, options, 'banner-loader') // 验证格式正确
  if (options.filename) {
    // 希望如果依赖的某个文件变化了，可以做到实时更新
    this.addDependency(path.resolve(__dirname, '../', options.filename))
    return fs.readFileSync(options.filename, 'utf8') + source
  }
  return options.text + source
}
module.exports = loader
