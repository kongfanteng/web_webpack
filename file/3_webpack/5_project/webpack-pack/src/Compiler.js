const path = require('path')
const fs = require('fs')
const babylon = require('babylon')
const traverse = require('@babel/traverse').default
const generator = require('@babel/generator').default

const template = fs.readFileSync(path.resolve(__dirname, 'template.ejs'), 'utf8')

/**
 * Webpack 配置约束
 * @typedef {Object} Config - Webpack 配置约束
 * @property {string} mode - development | production
 * @property {string | object} entry - default: './src/index.js'
 * @property {Output} output - default: { filename: 'bundle.js' }
 *
 * @typedef {Object} Output
 * @property {string} filename
 * @property {string|undefined} path
 *
 * */
class Compiler {
  /**
   * @constructor
   * @param {Config} config - Webpack 配置
   * */
  constructor(config) {
    /** @type {Config} config webpack 配置 */
    this.config = config
    /** @type {undefined | string} entryName - 入口文件名字 */
    this.entryName
    /** @type {Object} modules - 获取的所有模块 */
    this.modules = {}
    /** @type {string} */
    this.entry = this.config.entry
    /** @type {string} root - 获取当前运行命令时的路径 */
    this.root = process.cwd()
    /** @type {string} template - 获取模板内容 */
    this.template = template
  }

  /**
   * 通过数据渲染对应模板
   */
  emit() {
    // eslint-disable-next-line global-require
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
      fs.stat(p, (err) => {
        if (err) {
          fs.mkdirSync(p, { recursive: true })
        }
        const outputPath = path.join(p, fname)
        fs.writeFileSync(outputPath, this.assets[filename])
      })
    })
  }

  run() {
    // 从入口开始
    this.buildModule(path.join(this.root, this.entry), true)
    this.emit() // 渲染模板
  }

  /**
   * 打包模块
   * @param {string} modulePath - 模块入口地址（绝对路径）
   * @param {boolean} isMain - 是否为主要模块
   */
  buildModule(modulePath, isMain) {
    // 收集依赖关系
    const source = this.readSource(modulePath)
    const relativeModulePath = `./${path.relative(this.root, modulePath)}`
    if (isMain) {
      this.entryName = relativeModulePath
    }
    const { code, dependences } = this.parser(source, path.dirname(relativeModulePath)) // 源代码转化
    this.modules[relativeModulePath] = code
    dependences.forEach((dep) => {
      this.buildModule(path.join(this.root, dep))
    })
  }

  /**
   * 读取模块资源
   * @param {string} p - 文件绝对路径
   */
  readSource(p) {
    const content = fs.readFileSync(p, 'utf8')
    return content
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
    const dependences = [] // 存放所有代码依赖
    traverse(ast, { // visitor
      CallExpression(p) {
        const { node } = p
        if (node.callee.name === 'require') {
          node.callee.name = '__webpack_require__'
          const refPath = `${node.arguments[0].value}${path.extname(node.arguments[0].value) ? '' : '.js'}`
          const modulePath = `./${path.join(parentPath, refPath)}`
          dependences.push(modulePath)
          node.arguments[0].value = modulePath
        }
      },
    })
    const r = generator(ast)
    return { code: r.code, dependences }
  }
}

module.exports = Compiler
