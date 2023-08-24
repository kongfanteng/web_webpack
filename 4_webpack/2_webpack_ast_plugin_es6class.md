# Webpack-AST-抽象语法树插件-ES6 类转化为 ES5 构造函数

## 1、要转化的结果

- [ast/4_es6_class_plugin.js](./../file/3_webpack/4_project/ast/4_es6_class_plugin.js)

```js
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

```

## 2、类插件创建-classPlugin

- [ast/4_es6_class_plugin.js](./../file/3_webpack/4_project/ast/4_es6_class_plugin.js)

```js
const classPlugin = {
  visitor: {
    ClassDeclaration(path) {
      const { node } = path
      console.log('node:', node) // node: Node { type: 'ClassDeclaration', ...}
    },
  },
}

babel.transform(code, {
  plugins: [
    classPlugin,
  ],
})
```

## 3、类插件内容-构造函数转化

- [ast/4_es6_class_plugin.js](./../file/3_webpack/4_project/ast/4_es6_class_plugin.js)

```js
ClassDeclaration(path) {
  const { node } = path // 当前类的节点
  const { body } = node.body // 类中的函数
  const { id } = node // 当前类的名字
  const methods = body.map((method) => {
    if (method.kind === 'constructor') { // 构造函数处理
      return t.functionDeclaration(id, method.params, method.body)
    }
    return t.functionDeclaration(id, [], method.body)
  })
  path.replaceWithMultiple(methods)
},
```

- 测试插件-构造函数转化：[ast/4_es6_class_plugin.js](./../file/3_webpack/4_project/ast/4_es6_class_plugin.js)

```js
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
// function Person() {
//   return this.type;
// }
```

## 4、类插件内容-实例方法转化

- [ast/4_es6_class_plugin.js](./../file/3_webpack/4_project/ast/4_es6_class_plugin.js)

```js
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
```

- 测试插件-实例方法转化：[ast/4_es6_class_plugin.js](./../file/3_webpack/4_project/ast/4_es6_class_plugin.js)

```js
console.log('r.code:', r.code)
// 打印
// r.code: function Person(type) {
//   this.type = type;
// }
// Person.prototype.getType = function () {
//   return this.type;
// }
```
