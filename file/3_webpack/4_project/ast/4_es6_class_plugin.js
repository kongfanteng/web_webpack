const babel = require('@babel/core')
const t = require('@babel/types')

const code = `class Person {
  constructor(type){
    this.type = type
  }
  getType(){
    return this.type
  }
}`
// 转化为：
/*
function Person(type){
  this.type = type;
}
Person.prototype.getType = function(){
  return this.type;
}
*/

const classPlugin = {
  visitor: {
    ClassDeclaration(path) {
      const { node } = path // 当前类的节点
      const { body } = node.body // 类中的函数
      const { id } = node // 当前类的名字
      const methods = body.map((method) => {
        if (method.kind === 'constructor') { // 构造函数处理
          return t.functionDeclaration(id, method.params, method.body)
        }
        // Person.prototype
        let left = t.memberExpression(id, t.identifier('prototype'))
        // Person.prototype.getType
        left = t.memberExpression(left, method.key)
        const right = t.functionExpression(null, method.params, method.body)
        return t.assignmentExpression('=', left, right)
      })
      path.replaceWithMultiple(methods)
    },
  },
}

const r = babel.transform(code, {
  plugins: [
    classPlugin,
  ],
})
console.log('r.code:', r.code)
// 打印
// r.code: function Person(type) {
//   this.type = type;
// }
// Person.prototype.getType = function () {
//   return this.type;
// }
