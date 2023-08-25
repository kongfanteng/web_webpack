const babel = require('@babel/core')
const t = require('@babel/types')

const code = 'import { Button } from "antd"' // => import Button from 'antd/lib/Button'
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
          ], t.stringLiteral(`${node.source.value}/${specifier.local.name}`))
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
// r.code: import Button from "antd/Button";
