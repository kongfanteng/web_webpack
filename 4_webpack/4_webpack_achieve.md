# Webpack-实现自定义 Webpack

## 1、Webpack 学习目录（以下）

1. 自己实现一个 Webpack
2. loader 是如何编写的？
3. 插件是如何编写的？
4. creat-react-app 流程（扩展）

## 2、自定义 Webpack 初始化 dev 项目和 pack 项目

### dev 项目

- 新建 [webpack-dev/README.md](./../file/3_webpack/5_project/webpack-dev/README.md) > `# Webpack 使用自定义 Webpack 的项目`
- 新建 [webpack-pack/README.md](./../file/3_webpack/5_project/webpack-pack/README.md) > `# 实现自定义 Webpack 的项目`
- dev 项目中新增文件
  - [webpack-dev/src/index.js](./../file/3_webpack/5_project/webpack-dev/src/index.js) > `const a = require('./a.js'); console.log(a);`
  - [webpack-dev/src/a.js](./../file/3_webpack/5_project/webpack-dev/src/a.js) > `const b = require('./base/b.js'); const c = require('./base/c.js')`
  - [webpack-dev/src/base/b.js](./../file/3_webpack/5_project/webpack-dev/src/base/b.js) > `module.exports = 'b'`
  - [webpack-dev/src/base/c.js](./../file/3_webpack/5_project/webpack-dev/src/base/c.js) > `module.exports = 'c'`
- 配置 [webpack-dev/webpack.config.js](./../file/3_webpack/5_project/webpack-dev/webpack.config.js)

```js
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
}

```

- 安装 webpack 依赖 `yarn add webpack webpack-cli -D`
- 调试，执行-`npx webpack`

### pack 项目

- 初始化 npm init -y
- 添加 bin 执行命令：[webpack-pack/package.json](./../file/3_webpack/5_project/webpack-pack/package.json)

```js
"bin": {
  "kft-p": "./bin/www.js"
}
```

- bin 命令文件入口：[webpack-pack/bin/www.js](./../file/3_webpack/5_project/webpack-pack/bin/www.js)

```js
#! /usr/bin/env node

console.log('start bundle')

```

- 建立连接 `npm link`，在 dev 项目执行 `kft-p`，打印 `start bundle`

## 3、自定义 Webpack 内容-1

- 获取绝对路径：[webpack-pack/bin/www.js](./../file/3_webpack/5_project/webpack-pack/bin/www.js)

```js
const path = require('path')
// 以当前的执行目录产生一个绝对路径
const configPath = path.resolve('webpack.config.js')
console.log('configPath:', configPath) // configPath: /Users/workplace/web_webpack/file/3_webpack/5_project/webpack-dev/webpack.config.js
```

- 引用 webpack 配置：[webpack-pack/bin/www.js](./../file/3_webpack/5_project/webpack-pack/bin/www.js)

```js
// 引用 webpack 配置
const config = require(configPath)
console.log('config:', config)
// config: {
//   mode: 'development',
//   entry: './src/index.js',
//   output: { filename: 'bundle.js' }
// }
```

- 创建打包器文件 [webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
// 用来通过配置文件进行打包
class Compiler {
  constructor(config) {
    this.config = config
  }

  run() {
    console.log('开始打包', this)
  }
}

module.exports = Compiler

```

- 通过此配置文件打包：[webpack-pack/bin/www.js](./../file/3_webpack/5_project/webpack-pack/bin/www.js)

```js
const Compiler = require('../src/Compiler')
// 实例化打包器
const compiler = new Compiler(config)
// 开始打包
compiler.run()

// 开始打包 Compiler {
//   config: {
//     mode: 'development',
//     entry: './src/index.js',
//     output: { filename: 'bundle.js' }
//   }
// }
```

- run 执行逻辑：
  1. 打包，找到入口和所有依赖: require = `__webpack_require__`
  2. 使用模板和数据渲染一个打包后的文件
- [webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
/**
 * Webpack 配置约束
 * @typedef {Object} Config - Webpack 配置约束
 * @property {string} mode - development | production
 * @property {string | object} entry - default: './src/index.js'
 * @property {object} output - default: { filename: 'bundle.js' }
 * */
class Compiler {
  /**
   * @constructor
   * @param {Config} config - Webpack 配置
   * */
  constructor(config) {
    /** @type {Config} config webpack 配置 */
    this.config = config
    /** @type {undefined | string} */
    this.entryName // 获取的入口名字
    /** @type {Object} */
    this.modules = {} // 获取的所有模块
    /** @type {string} */
    this.entry = this.config.entry
    /** @type {string} root */
    this.root = process.cwd() // 获取当前运行命令时的路径
    console.log('this.entry, this.root:', this.entry, this.root) // this.entry, this.root: ./src/index.js /Users/workplace/web_webpack/file/3_webpack/5_project/webpack-dev
  }

  run() {
    this.buildModule()
  }

  buildModule() {
    // 收集依赖关系
    console.log(this)
    // Compiler {
    //   config: {
    //     mode: 'development',
    //     entry: './src/index.js',
    //     output: { filename: 'bundle.js' }
    //   },
    //   entryName: undefined,
    //   modules: {},
    //   entry: './src/index.js',
    //   root: '/Users/workplace/web_webpack/file/3_webpack/5_project/webpack-dev'
    // }
  }
}

module.exports = Compiler

```

- 从入口开始：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
run() {
  // 从入口开始
  this.buildModule(path.join(this.root, this.entry), true)
}

/**
 * 打包模块
 * @param {string} modulePath - 模块入口地址（绝对路径）
 * @param {boolean} isMain - 是否为主要模块
 */
buildModule(modulePath, isMain) {
  // 收集依赖关系
  console.log('modulePath, isMain:', modulePath, isMain)
  // modulePath, isMain:
  // /Users/workplace/web_webpack/file/3_webpack/5_project/webpack-dev/src/index.js
  // true
}
```

- 读取资源：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
/**
 * 打包模块
 * @param {string} modulePath - 模块入口地址（绝对路径）
 * @param {boolean} isMain - 是否为主要模块
 */
buildModule(modulePath, isMain) {
  // 收集依赖关系
  const sourse = this.readSource(modulePath)
  console.log(sourse)
  /* const a = require('./a')
  console.log(a) */
}

/**
 * 读取模块资源
 * @param {string} p - 文件绝对路径
 */
readSource(p) {
  const content = fs.readFileSync(p, 'utf8')
  return content
}
```

- 获取入口文件：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
buildModule(modulePath, isMain) {
  // 收集依赖关系
  const sourse = this.readSource(modulePath)
  if (isMain) {
    this.entryName = modulePath
  }
  console.log('this.entryName:', this.entryName) // this.entryName: /Users/workplace/web_webpack/file/3_webpack/5_project/webpack-dev/src/index.js
}
```

- 获取相对根目录文件路径：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
buildModule(modulePath, isMain) {
  // 收集依赖关系
  const sourse = this.readSource(modulePath)
  const relativeModulePath = path.relative(this.root, modulePath)
  if (isMain) {
    this.entryName = relativeModulePath
  }
  console.log('this.entryName:', this.entryName) // src/index.js
}
```

- 获取设置后的模块对象 modules：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
run() {
  // 从入口开始
  this.buildModule(path.join(this.root, this.entry), true)
  console.log(this.modules) // { 'src/index.js': "const a = require('./a')\n\nconsole.log(a)\n" }
}

/**
 * 打包模块
 * @param {string} modulePath - 模块入口地址（绝对路径）
 * @param {boolean} isMain - 是否为主要模块
 */
buildModule(modulePath, isMain) {
  // 收集依赖关系
  const sourse = this.readSource(modulePath)
  const relativeModulePath = path.relative(this.root, modulePath)
  if (isMain) {
    this.entryName = relativeModulePath
  }
  this.modules[relativeModulePath] = sourse
}
```

## 4、自定义 Webpack 内容-2

- 安装 ast 分析依赖包 `yarn add babylon @babel/traverse @babel/generator`
- 源代码转化：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

buildModule(modulePath, isMain) {
  // ...
  this.parser(source, path.dirname(relativeModulePath)) // 源代码转化
}

/**
 * 转化源代码-对 source 进行 ast 语法解析
 * @desc
 *  require('./a') => __webpack_require__('parentPath' + ./a.js)
 *  1）把源代码转化成 ast 语法树
 *  2）遍历树，修改树
 *  3）生成新的代码
 * @param {string} source - 源代码
 * @param {string} parentPath - 父路径
 */
parser(source, parentPath) {
  const ast = babylon.parse(source)
  traverse(ast, { // visitor
    CallExpression(p) {
      const { node } = p
      console.log('node:', node) // node: Node { type: 'CallExpression', ... }
    },
  })
}
```

- 转化源代码逻辑-`require('./a') => __webpack_require__('parentPath' + ./a.js)`：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
parser(source, parentPath) {
    const ast = babylon.parse(source)
    traverse(ast, { // visitor
      CallExpression(p) {
        const { node } = p
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          const refPath = node.arguments[0].value
          node.arguments[0].value = `./${path.join(parentPath, refPath)}`
        }
      },
    })
    const r = generator(ast)
    console.log('r.code:', r.code) // 转化后的源代码
    // 打印：
    // r.code: const a = __webpack_require__("./src/a");
    // console.log(a);
    return r.code
  }
```

- 对模块对象 modules 进行属性赋值：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
buildModule(modulePath, isMain) {
  // ...
  const code = this.parser(source, path.dirname(relativeModulePath)) // 源代码转化
  this.modules[relativeModulePath] = code
}

run() {
  // 从入口开始
  this.buildModule(path.join(this.root, this.entry), true)
  console.log(this.modules)
  // 打印
  // {
  //   'src/index.js': 'const a = __webpack_require__("./src/a");\nconsole.log(a);'
  // }
}
```

- 存放所有代码依赖：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
buildModule(modulePath, isMain) {
  // ...
  const { code, dependences } = this.parser(source, path.dirname(relativeModulePath)) // 源代码转化
  console.log('dependences:', dependences) // dependences: [ './src/a' ]
  // ...
}

parser(source, parentPath) {
  const ast = babylon.parse(source)
  const dependences = [] // 存放所有代码依赖
  traverse(ast, { // visitor
    CallExpression(p) {
      const { node } = p
      if (node.callee.name === 'require') {
        node.callee.name = '__webpack_require__'
        const refPath = node.arguments[0].value
        const modulePath = `./${path.join(parentPath, refPath)}`
        dependences.push(modulePath)
        node.arguments[0].value = modulePath
      }
    },
  })
  const r = generator(ast)
  return { code: r.code, dependences }
}
```

- 递归-收集每个模块的依赖：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
run() {
  // 从入口开始
  this.buildModule(path.join(this.root, this.entry), true)
  console.log(this.modules)
  /* {
    'src/index.js': 'const a = __webpack_require__("./src/a.js");\nconsole.log(a);',
    'src/a.js': 'const b = __webpack_require__("./src/base/b.js");\n' +
      'const c = __webpack_require__("./src/base/c.js");\n' +
      "const a = 'a';\n" +
      'module.exports = {\n' +
      '  b,\n' +
      '  c,\n' +
      '  a\n' +
      '};',
    'src/base/b.js': "module.exports = 'b';",
    'src/base/c.js': "module.exports = 'c';"
  } */
}
buildModule(modulePath, isMain) {
  // ...
  dependences.forEach((dep) => {
    this.buildModule(path.join(this.root, dep))
  })
}
parser(source, parentPath) {
  // ...
  traverse(ast, { // visitor
    CallExpression(p) {
      const { node } = p
      if (node.callee.name === 'require') {
        // ...
        const refPath = `${node.arguments[0].value}${path.extname(node.arguments[0].value) ? '' : '.js'}`
        // ...
      }
    },
  })
  // ...
}
```

## 5、自定义 Webpack 内容-3（使用模板和数据渲染一个打包后的文件）

- 安装依赖包 `yarn add ejs`
- 创建模板文件 template.ejs：[webpack-pack/src/template.ejs](./../file/3_webpack/5_project/webpack-pack/src/template.ejs)

```ejs
 (() => {
  var __webpack_modules__ = ({
    <%for(let key in modules){%>
      "<%=key%>":
      ((module, __unused_webpack_exports, __webpack_require__) => {
        eval(`<%-modules[key]%>`);
         }),
    <%}%>
  });
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
   var cachedModule = __webpack_module_cache__[moduleId];
   if (cachedModule !== undefined) {
    return cachedModule.exports;
   }
   var module = __webpack_module_cache__[moduleId] = {
    // no module.id needed
    // no module.loaded needed
    exports: {}
   };
   __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
   return module.exports;
  }
  var __webpack_exports__ = __webpack_require__("<%=entryName%>");
 })()
;
```

- 定义输出目录：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
const template = fs.readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8')

constructor(config) {
  // ...
  /** @type {string} template - 获取模板内容 */
  this.template = template
}

emit() {
  // eslint-disable-next-line global-require
  const ejs = require('ejs')
  const renderStr = ejs.render(this.template, {
    entryName: this.entryName,
    modules: this.modules,
  })
  // 输出的文件名
  const { filename } = this.config.output
  /** @type {string} p - 输出路径 */
  const p = this.config.output.path || path.resolve('dist')

  // 输出结果
  const outputPath = path.join(p, filename)
  console.log('outputPath:', outputPath) // outputPath: /Users/workplace/web_webpack/file/3_webpack/5_project/webpack-dev/dist/bundle.js
}

run() {
  // ...
  this.emit() // 渲染模板
}
```

- 对所有要输出的文件遍历写入：[webpack-pack/src/Compiler.js](./../file/3_webpack/5_project/webpack-pack/src/Compiler.js)

```js
emit() {
  const ejs = require('ejs')
  const renderStr = ejs.render(this.template, {
    entryName: this.entryName,
    modules: this.modules,
  })
  // 定义所有要输出的文件存放对象 assets
  this.assets = {}
  // 输出的文件名
  const { filename } = this.config.output
  // 放置要输出的文件，放到 assets 中
  this.assets[filename] = renderStr // html-webpack-plugin
  /** @type {string} p - 输出路径 */
  const p = this.config.output.path || path.resolve('dist')

  Object.keys(this.assets).forEach((fname) => {
    const outputPath = path.join(p, fname)
    fs.writeFileSync(outputPath, this.assets[filename])
  })
}
```