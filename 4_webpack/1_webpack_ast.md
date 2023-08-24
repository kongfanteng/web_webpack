# Webpack-AST-抽象语法树

## 1、抽象语法树概念&用途（Abstract Syntax Tree）

- 抽象语法树简称 AST，是源代码的抽象语法结构的树状表现形式
- 抽象语法树用途
  - 代码语法的检查、代码风格的检查、代码的格式化、代码的高亮、代码错误提示、代码自动补全等
  - 代码混淆压缩
  - 优化变更代码，改变代码结构使达到想要的结构

## 2、Webpack ast 语法树执行

1. 把代码转换成 AST 语法树 esprima, code => ast
2. 遍历每一个树的节点，深度优先，estraverse, traverse, ast
3. 更改树
4. 重新生成代码，escodegen, est => code

- [代码转 ast](https://astexplorer.net)

```js
let fn = (a, b) => a + b
```

- 转化为树的 JSON 结构

```json
{
  "type": "Program",
  "start": 0,
  "end": 25,
  "body": [
    {
      "type": "VariableDeclaration",
      "start": 0,
      "end": 24,
      "declarations": [
        {
          "type": "VariableDeclarator",
          "start": 4,
          "end": 24,
          "id": {
            "type": "Identifier",
            "start": 4,
            "end": 6,
            "name": "fn"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "start": 9,
            "end": 24,
            "id": null,
            "expression": true,
            "generator": false,
            "async": false,
            "params": [
              {
                "type": "Identifier",
                "start": 10,
                "end": 11,
                "name": "a"
              },
              {
                "type": "Identifier",
                "start": 13,
                "end": 14,
                "name": "b"
              }
            ],
            "body": {
              "type": "BinaryExpression",
              "start": 19,
              "end": 24,
              "left": {
                "type": "Identifier",
                "start": 19,
                "end": 20,
                "name": "a"
              },
              "operator": "+",
              "right": {
                "type": "Identifier",
                "start": 23,
                "end": 24,
                "name": "b"
              }
            }
          }
        }
      ],
      "kind": "let"
    }
  ],
  "sourceType": "module"
}
```

## 3、code 转 ast 结构，处理后转 code

- 安装依赖包 `yarn add esprima estraverse escodegen`

### code => ast

- [ast/1_traverse.js](./../file/3_webpack/4_project/ast/1_traverse.js)

```js
const esprima = require('esprima')
const code = `function ast() {}`
const ast = esprima.parseScript(code)
console.log('ast:', ast)
/*
ast: Script {
  type: 'Program',
  body: [
    FunctionDeclaration {
      type: 'FunctionDeclaration',
      id: [Identifier],
      params: [],
      body: [BlockStatement],
      generator: false,
      expression: false,
      async: false
    }
  ],
  sourceType: 'script'
}
*/
```

### ast 深度优先遍历

- [ast/1_traverse.js](./../file/3_webpack/4_project/ast/1_traverse.js)

```js
const esprima = require('esprima')
const estraverse = require('estraverse')

const code = 'function ast() {}'
const ast = esprima.parseScript(code)
estraverse.traverse(ast, {
  enter(node) {
    console.log('enter-node.type:', node.type)
  },
  leave(node) {
    console.log('leave-node.type:', node.type)
  },
})
// 打印：（深度优先遍历）
// enter-node.type: Program
// enter-node.type: FunctionDeclaration
// enter-node.type: Identifier
// leave-node.type: Identifier
// enter-node.type: BlockStatement
// leave-node.type: BlockStatement
// leave-node.type: FunctionDeclaration
// leave-node.type: Program
```

### ast 处理并转 code

- [ast/1_traverse.js](./../file/3_webpack/4_project/ast/1_traverse.js)

```js
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
```

## 4、es6 => es5

- 安装 babel 依赖包`yarn add @babel/core @babel/preset-env`
- [ast/2_arrow_fn.js](./../file/3_webpack/4_project/ast/2_arrow_fn.js)

```js
const babel = require('@babel/core')

const code = 'let fn = (a, b) => a + b'
const r = babel.transform(code, {
  presets: [
    '@babel/preset-env',
  ],
  plugins: [],
})
console.log('r.code:', r.code)
// 打印：
// r.code: "use strict";

// var fn = function fn(a, b) {
//   return a + b;
// };
```

- 只转化箭头函数为匿名函数
- [ast/2_arrow_fn.js](./../file/3_webpack/4_project/ast/2_arrow_fn.js)

```js
const babel = require('@babel/core')
const code = 'let fn = (a, b) => a + b'
const r = babel.transform(code, {
  plugins: [
    '@babel/plugin-transform-arrow-functions',
  ],
})
console.log('r.code:', r.code)
// 打印：
// r.code: 
// let fn = function (a, b) {
//   return a + b;
// };
```

## 5、使用自定义插件实现箭头函数转化

- 访问者模式：[ast/3_arrow_fn_plugin.js](./../file/3_webpack/4_project/ast/3_arrow_fn_plugin.js)

```js
const babel = require('@babel/core')

const code = 'let fn = (a, b) => a + b'

const arrowFunctionPlugin = { // 访问者模式
  visitor: { // 当访问到某个路径时进行匹配
    ArrowFunctionExpression(path) {
      const { node } = path
      console.log('node:', node) // node: Node { type: 'ArrowFunctionExpression', ... }
    },
  },
}

const r = babel.transform(code, {
  plugins: [
    arrowFunctionPlugin,
  ],
})
console.log('r.code: \r\n', r.code)

```

- 安装依赖包 `yarn add @babel/types`, 作用：判断 node 是不是这个 node，生成对应表达式
- 匹配路径：[ast/3_arrow_fn_plugin.js](./../file/3_webpack/4_project/ast/3_arrow_fn_plugin.js)

```js
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
```
