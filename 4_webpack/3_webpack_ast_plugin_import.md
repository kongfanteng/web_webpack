# Webpack-AST-ImportPlugin

## 1、tree-shaking 描述

- tree-shaking 把没用到的代码摇晃掉
- `import { Button } from 'antd'` // import-plugin 按需加载
- `import Button from 'antd/lib/Button'`
- `import _, { join } from 'lodash'` => `import _ from 'lodash' + import join from lodash/join`
- 实现 babel 的 import 插件的转化

## 2、import 转化插件创建

- [ast/5_import_plugin.js](./../file/3_webpack/4_project/ast/5_import_plugin.js)

```js
const babel = require('@babel/core')
// const t = require('@babel/types')

const code = 'import { Button } from "antd"' // => import Button from 'antd/lib/Button'
const importPlugin = {
  visitor: {
    ImportDeclaration(path) {
      const { node } = path
      console.log('node:', node) // node: Node { type: 'ImportDeclaration', ...}
    },
  },
}

babel.transform(code, {
  plugins: [
    importPlugin,
  ],
})

```

- ast 替换时，`import { Button } => import Button`
- 只需要处理非默认导入，如果时默认导入就不需要处理了
- import 插件内容-默认导出设置：[ast/5_import_plugin.js](./../file/3_webpack/4_project/ast/5_import_plugin.js)

```js
const importPlugin = {
  visitor: {
    ImportDeclaration(path) {
      const { node } = path
      let { specifiers } = node
      // 当前长度不是 1，并且不是默认导出，需进行转化
      if (!(specifiers.length === 1 && t.isImportDefaultSpecifier(specifiers[0]))) {
        specifiers = specifiers.map((specifier) => {
          if (t.isImportDefaultSpecifier(specifier)) {
            // 当前是默认导出 import xxx from
            return t.importDeclaration([
              t.importDefaultSpecifier(specifier.local),
            ], t.stringLiteral(node.source.value))
          }
          return t.importDeclaration([
            t.importDefaultSpecifier(specifier.local),
          ], t.stringLiteral(node.source.value))
        })
        path.replaceWithMultiple(specifiers)
      }
    },
  },
}

const r = babel.transform(code, {
  plugins: [
    importPlugin,
  ],
})
console.log('r.code:', r.code)
// r.code: import Button from "antd";
```

## 3、非默认导出处理

- [ast/5_import_plugin.js](./../file/3_webpack/4_project/ast/5_import_plugin.js)

```js
specifiers = specifiers.map((specifier) => {
  // ...
  return t.importDeclaration([
    t.importDefaultSpecifier(specifier.local),
  ], t.stringLiteral(`${node.source.value}/${specifier.local.name}`))
})

console.log('r.code:', r.code)
// r.code: import Button from "antd/Button";
```