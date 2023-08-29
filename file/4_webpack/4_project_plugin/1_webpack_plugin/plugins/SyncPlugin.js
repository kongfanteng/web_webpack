class SyncPlugin {
  constructor({ filename }) {
    this.filename = filename
  }

  apply(compiler) {
    compiler.hooks.emit.tap('SyncPlugin', (compilation) => {
      const { assets } = compilation
      let content = '# 文件名    文件大小\r\n'
      Object.entries(assets).forEach(([filename, fileObj]) => {
        content += `\r\n- ${filename}    ${fileObj.size()}b`
      })
      content += `\r\n\r\n>文件总个数    ${Object.entries(assets).length} 个`
      compilation.assets[this.filename] = {
        source() {
          return content
        },
        size() {
          return content.length
        },
      }
    })
    // compiler.hooks.emit.tapAsync('SyncPlugin', (compilation, cb) => {
    //   setTimeout(() => {
    //     console.log('tapAsync 串行等待中...')
    //     cb()
    //   }, 1000)
    // })
    // compiler.hooks.emit.tapPromise('SyncPlugin', () => new Promise((resolve) => {
    //   setTimeout(() => {
    //     console.log('tapPromise 等待中...')
    //     resolve()
    //   }, 1000)
    // }))
  }
}
module.exports = SyncPlugin
