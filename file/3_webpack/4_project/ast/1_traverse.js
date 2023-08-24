const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')

const code = 'function ast() {}'
const ast = esprima.parseScript(code)

estraverse.traverse(ast, {
  enter(node) {
    if (node.type === 'Identifier') {
      // eslint-disable-next-line no-param-reassign
      node.name = 'hello'
    }
  },
  leave(node) {
    console.log('leave-node.type:', node.type)
  },
})
const r = escodegen.generate(ast)
console.log('r:', r) // r: function hello() {}
