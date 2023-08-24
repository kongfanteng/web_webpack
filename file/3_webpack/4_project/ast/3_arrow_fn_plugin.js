const babel = require('@babel/core')
const t = require('@babel/types')

const code = 'let fn = (a, b) => a + b'

const arrowFunctionPlugin = { // 访问者模式
  visitor: { // 当访问到某个路径时进行匹配
    ArrowFunctionExpression(path) {
      const { node } = path // node-对应的对象；
      const { params } = node // params-当前函数的参数；
      let { body } = node // body-函数体；
      if (!t.isBlockStatement(body)) { // 如果当前有代码块了，就不处理了
        // 否则声明一个代码块，返回以前的箭头函数的结果
        body = t.blockStatement([t.returnStatement(body)])
      }
      const functionExpression = t.functionExpression(null, params, body)
      path.replaceWith(functionExpression) // 用新内容替换老内容
    },
  },
}

const r = babel.transform(code, {
  plugins: [
    // 使用自己的插件实现箭头函数的转化（babel插件的写法，webpack可能会使用到 babel 插件）
    arrowFunctionPlugin,
  ],
})
console.log('r.code:', r.code)
