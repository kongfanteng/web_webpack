class EmitPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('EmitPlugin', () => {
      console.log('emit-plugin')
    })
  }
}

module.exports = EmitPlugin
