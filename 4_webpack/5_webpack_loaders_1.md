# Webpack-CustomLoader-自定义 loader

## 1、custom-less-loader-1

- 配置项添加 moudles：[webpack-dev/webpack.config.js](./../file/4_webpack/1_project/webpack-dev/webpack.config.js)

```js
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, 'loaders', 'style-loader.js'),
          path.resolve(__dirname, 'loaders', 'less-loader.js'),
        ],
      },
    ],
  },
}

```

- 新建文件：[webpack-dev/loaders/style-loader.js](./../file/4_webpack/1_project/webpack-dev/loaders/style-loader.js)

```js
function loader(source) {
  return source
}
module.exports = loader

```

- 新建文件：[webpack-dev/loaders/less-loader.js](./../file/4_webpack/1_project/webpack-dev/loaders/less-loader.js)

```js
function loader(source) {
  return source
}
module.exports = loader

```

- pack 读取资源 readSource 时，判断路径是否可匹配 loader：[webpack-pack/src/Compiler.js](./../file/4_webpack/1_project/webpack-pack/src/Compiler.js)
- 新建 [webpack-dev/src/index.less](./../file/4_webpack/1_project/webpack-dev/src/index.less)

```js
html{
  body{
    background: blue;
  }
}
```

- 导入 index.less：[webpack-dev/src/index.js](./../file/4_webpack/1_project/webpack-dev/src/index.js)

```js
require('./index.less')
```

## 2、custom-less-loader-2

- readSource 判断路径匹配到 loader 逻辑：[webpack-pack/src/Compiler.js](./../file/4_webpack/1_project/webpack-pack/src/Compiler.js)

```js
readSource(p) {
  /** @type {string} */
  let content = fs.readFileSync(p, 'utf8')
  // 读取资源 readSource 时，判断路径是否可匹配 loader
  const { rules } = this.config.module
  for (let i = 0; i < rules.length; i += 1) {
    // 获取到当前的正则 test 和对应的处理方法数组 use
    const { test, use } = rules[i]
    if (test.test(p)) { // loader 中可能会有异步
      let len = use.length - 1
      // eslint-disable-next-line no-loop-func
      function normalLoader() {
        const loader = use[len]
        const fn = require(loader)
        content = fn(content)
        if (len > 0) { // 必须保证还有 loader 才继续执行
          len -= 1
          normalLoader()
        }
      }
      normalLoader()
    }
  }
  return content
}
```

- 安装 less 依赖包`npm i less -D`，less-loader 作用：匹配到 less 文件，使用 less 转化
- [webpack-dev/loaders/less-loader.js](./../file/4_webpack/1_project/webpack-dev/loaders/less-loader.js)

```js
const less = require('less')

function loader(source) {
  let css;
  less.render(source, (err, r) => {
    css = r.css
  })
  return css
}
module.exports = loader
```

- [webpack-dev/loaders/style-loader.js](./../file/4_webpack/1_project/webpack-dev/loaders/style-loader.js)

```js
function loader(source) {
  const code = `
    let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(style)
  `
  return code.replace(/\\/g, '\\\\') // "\n" => "\\n"
}
module.exports = loader

```

## 3、webpack-tapable-钩子

- pack 安装 tapable 依赖包 `npm i tapable -D`
- 创建钩子：[webpack-pack/src/Compiler.js](./../file/4_webpack/1_project/webpack-pack/src/Compiler.js)

```js
constructor(config) {
  // ...
  /**
   * @type {Hooks} hooks
   * @typedef {Object} Hooks
   * @property {SyncHook} entryOption
   * @property {SyncHook} run
   * @property {SyncHook} emit
   * @property {SyncHook} afterEmit
   */
  this.hooks = {
    entryOption: new SyncHook(),
    run: new SyncHook(),
    emit: new SyncHook(),
    afterEmit: new SyncHook(),
  }
}

run() {
  this.hooks.run.call()
  // 从入口开始
  this.buildModule(path.join(this.root, this.entry), true)
  this.hooks.emit.call()
  this.emit() // 渲染模板
  this.hooks.afterEmit.call()
}
```

- 添加启动钩子：[webpack-pack/bin/www.js](./../file/4_webpack/1_project/webpack-pack/bin/www.js)

```js
compiler.hooks.entryOption.call()
// 开始打包
compiler.run()
```

## 4、webpack-plugins-EmitPlugin

- 新建：[webpack-dev/plugins/EmitPlugin.js](./../file/4_webpack/1_project/webpack-dev/plugins/EmitPlugin.js)

```js
class EmitPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('EmitPlugin', () => {
      console.log('emit-plugin')
    })
  }
}

module.exports = EmitPlugin

```

- 引入插件 EmitPlugin：[webpack-dev/webpack.config.js](./../file/4_webpack/1_project/webpack-dev/webpack.config.js)

```js
const EmitPlugin = require('./plugins/EmitPlugin')

plugins: [
  new EmitPlugin(), // 一般情况，插件的顺序不一定，因为多个插件监听了同一个事件，谁在前谁执行
],
```

- [webpack-pack/bin/www.js](./../file/4_webpack/1_project/webpack-pack/bin/www.js)

```js
if (Array.isArray(config.plugins)) {
  config.plugins.forEach((plugin) => {
    plugin.apply(compiler)
  })
}
```

- 新增 done 钩子：[webpack-pack/src/Compiler.js](./../file/4_webpack/1_project/webpack-pack/src/Compiler.js)

```js
this.hooks = {
  // ...
  done: new SyncHook(),
}

run() {
  // ...
  this.hooks.done.call()
}
```

- DonePlugin：[webpack-dev/plugins/DonePlugin.js](./../file/4_webpack/1_project/webpack-dev/plugins/DonePlugin.js)

```js
class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap('DonePlugin', () => {
      console.log('done')
    })
  }
}

module.exports = DonePlugin

```

- [webpack-dev/webpack.config.js](./../file/4_webpack/1_project/webpack-dev/webpack.config.js)

```js
const DonePlugin = require('./plugins/DonePlugin')

plugins: [
  new DonePlugin(), // 一般情况，插件的顺序不一定，因为多个插件监听了同一个事件，谁在前谁执行
  new EmitPlugin(),
],

// 打印：
// emit-plugin
// done
```

- 通过自定义插件：clean-webpack-plugin; vue vue-sckleton;
- 在 index.html 中 'baidu.com/src'
- 'qq.com/s' （替换最后产生的资源比较多）
  1. 使用插件的注意事项
     1. 哪个生命周期适合你
     2. 你要知道这些生命周期的执行顺序

## 5、webpack-loader

- 什么是 loader？
  - webpack 只能处理 JavaScript 的模块，如果要处理其他类型的文件，需要使用 loader 进行转换。loader 是 webpack 中一个重要的概念，它是指用来将一段代码转换成另一段代码的 webpack 加载器。
- 一个简单的 loader

```js
function loader(source) {
  return 'hello'
}
module.exports = loader
```

- 创建项目 webpack-loader：[webpack-loader/webpack.config.js](./../file/4_webpack/2_project/webpack-loader/webpack.config.js)

```js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
}

```

- [webpack-loader/src/index.js](./../file/4_webpack/2_project/webpack-loader/src/index.js)

- [webpack-loader/loaders/loader1.js](./../file/4_webpack/2_project/webpack-loader/loaders/loader1.js)
- [webpack-loader/loaders/loader2.js](./../file/4_webpack/2_project/webpack-loader/loaders/loader2.js)
- [webpack-loader/loaders/loader3.js](./../file/4_webpack/2_project/webpack-loader/loaders/loader3.js)

```js
function loader(source) {
  console.log(1) // loader1 => 1; loader2 => 2; loader3 => 3;
  return source
}
module.exports = loader

```

- 配置 resolve 和 resolveLoader: [webpack-loader/webpack.config.js](./../file/4_webpack/2_project/webpack-loader/webpack.config.js)

```js
const path = require('path')

resolveLoader: {
  alias: {
    loader1: path.resolve(__dirname, 'loaders', 'loader1.js'),
    loader2: path.resolve(__dirname, 'loaders', 'loader2.js'),
    loader3: path.resolve(__dirname, 'loaders', 'loader3.js'),
  },
},
module: {
  rules: [
    {
      test: /\.js$/,
      use: {
        loader: 'loader1',
      },
    },
    {
      test: /\.js$/,
      use: {
        loader: 'loader2',
      },
    },
    {
      test: /\.js$/,
      use: {
        loader: 'loader3',
      },
    },
  ],
},
```

- 安装 webpack 依赖包 `npm i webpack webpack-cli -D`
- 执行 npx webpack 打印 `3 2 1`
- pitch 执行 loader 前逻辑
  - [webpack-loader/loaders/loader1.js](./../file/4_webpack/2_project/webpack-loader/loaders/loader1.js)
  - [webpack-loader/loaders/loader2.js](./../file/4_webpack/2_project/webpack-loader/loaders/loader2.js)
  - [webpack-loader/loaders/loader3.js](./../file/4_webpack/2_project/webpack-loader/loaders/loader3.js)

```js

loader.pitch = () => {
  console.log('loader3-pitch'); // loader1 => loader1-pitch; loader2 => loader2-pitch; loader3 => loader3-pitch;
}

// 打印：
// loader1-pitch
// loader2-pitch
// loader3-pitch
// 3
// 2
// 1
```

- loader 执行顺序
  - USE: [loader3, loader2, loader1]
  - Pitch loader - 无返回值
  - Pitch Loader3 -> Pitch Loader2 -> Pitch Loader1 -> resource 资源 -> Normal Loader1 -> Normal Loader2 -> Normal Loader3
- loader 特点：尽可能职责单一，每一个 loader 只干一件事
- 多个 loader 可以组合，pitch 可以中断 loader 的执行，类似中间件; less-loader/style-loader/process-loader
- pitch 中断测试：[webpack-loader/loaders/loader2.js](./../file/4_webpack/2_project/webpack-loader/loaders/loader2.js)

```js
loader.pitch = () => {
  console.log('loader2-pitch');
  return 'xxxx'
}
// 打印：
// loader1-pitch
// loader2-pitch
// 1
```

- loader 不能有状态，只能是一个纯函数
