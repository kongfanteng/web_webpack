const HtmlWebpackPlugin = require('html-webpack-plugin')

class InlineSourcePlugin {
  constructor({ match }) {
    /** @type {RegExp} */
    this.match = match
  }

  processTags(data, compilation) {
    data.html = data.html.replace(/<script.*?>[\\s.]*?<\/script>/, (scriptContent) => {
      const content = scriptContent.match(/src="(.+?)"/)[1]
      const script = `<script>${compilation.assets[content].source()}</script>`
      delete compilation.assets[content]
      return script
    })
    data.html = data.html.replace(/<link.*?>/, (styleContent) => {
      const content = styleContent.match(/href="(.+?)"/)[1]
      const style = `<style>${compilation.assets[content].source()}</style>`
      delete compilation.assets[content]
      return style
    })
    return { ...data }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InlineSourcePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InlineSourcePlugin',
        (data, cb) => {
          data = this.processTags(data, compilation)
          cb(null, data)
        },
      )
    })
  }
}

module.exports = InlineSourcePlugin
