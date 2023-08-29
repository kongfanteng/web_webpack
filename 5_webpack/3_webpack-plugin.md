# Webpack-Plugin

## 1、Webpack 中的 Plugin & SyncPlugin

- webpack 通过 plugins 实现各种功能。开发者可以通过插件引入他们自己的行为到 webpack 构建流程中。但是需要理解一些 webpack 底层的内部特性来做钩子。
- 新建项目 [1_webpack_plugin](./../file/4_webpack/4_project_plugin/1_webpack_plugin/webpack.config.js), 初始化 `npm init -y`
- 安装依赖 `sudo npm i webpack webpack-cli webpack-dev-server html-webpack-plugin mini-css-extract-plugin css-loader style-loader -D`

### 1）webpack 配置项[webpack.config.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/webpack.config.js)

```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * Webpack 配置约束
 * @type {Config}
 * @typedef {Object} Config - Webpack 配置约束
 * @property {string} mode - development | production
 * @property {string | object} entry - default: './src/index.js'
 * @property {Output} output - default: { filename: 'bundle.js' }
 * @property {Module} [module]
 * @property {[stirng, HtmlWebpackPlugin][]} [plugins]
 *
 * @typedef {Object} Output
 * @property {string} filename
 * @property {string|undefined} path
 *
 * @typedef {Object} Module
 * @property {Rule[]} rules
 *
 * @typedef {object} Rule
 * @property {RegExp} test - 正则（匹配）
 * @property {['pre', 'post', 'normal']} [enforce] - 执行顺序控制: pre-先执行; post-后执行; normal-顺序执行（默认）;
 * @property {string|Use| string[]} use - 加载的 loader
 *
 * @typedef {object} Use
 * @property {string} loader - loader 名
 * @property {{presets: [ ['@babel/preset-env'], string[], string ]}} [options] - loader 配置项
 * */
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}

```

### 2）入口文件内容：[src/index.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/src/index.js) > `import './index.css'`

### 3）CSS 内容：[src/index.css](./../file/4_webpack/4_project_plugin/1_webpack_plugin/src/index.css) > `body{background-color: blueviolet;}`

### 4）新建插件 SyncPlugin.js: [plugins/SyncPlugin.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/plugins/SyncPlugin.js)

```js
class SyncPlugin {

}
module.exports = SyncPlugin

```

### 5）webpack 配置文件中引入：[webpack.config.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/webpack.config.js)

```js
const SyncPlugin = require('./plugins/SyncPlugin')

plugins: [
  // ...
  new SyncPlugin(),
],
```

## 2、Webpack-SyncPlugin-记录所有文件名字和大小

### 新建创建应用方法 apply：[plugins/SyncPlugin.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/plugins/SyncPlugin.js)

```js
class SyncPlugin {
  apply(compiler) {
    // 钩子：tap call; tap callAsync; tapAsync callAsync; tapPromise promise;
    compiler.hooks.emit.tap('SyncPlugin', (compilation) => {
      console.log('compilationKeys:', Object.keys(compilation), this)
      /* compilationKeys: [
        'assets',
        'hooks',
        'hash',
        ...
      ] */
      console.log('compilationAssetsKeys:', Object.keys(compilation.assets), this)
      /* compilationAssetsKeys: [ 'main.css', 'bundle.js', 'index.html' ] */
      console.log(compilation.assets['index.html'])
    })
  }
}
module.exports = SyncPlugin

```

### 为 index.txt 赋值：[plugins/SyncPlugin.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/plugins/SyncPlugin.js)

```js
class SyncPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('SyncPlugin', (compilation) => {
      compilation.assets['index.txt'] = {
        source() {
          return 'hello'
        },
        size() {
          return 5
        },
      }
    })
  }
}
module.exports = SyncPlugin
```

- 在 dist 目录下新增了 index.txt > `hello`

### 配置-记录所有文件名字和大小：[webpack.config.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/webpack.config.js)

```js
/*
文件名  文件大小
xxxx   100k

总共文件数 xxx
 */
new SyncPlugin({
  filename: 'r.md',
}),
```

### 插件编写：[plugins/SyncPlugin.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/plugins/SyncPlugin.js)

```js
class SyncPlugin {
  constructor({ filename }) {
    this.filename = filename
  }

  apply(compiler) {
    compiler.hooks.emit.tap('SyncPlugin', (compilation) => {
      const { assets } = compilation
      let content = '# 文件名    文件大小\r\n'
      Object.entries(assets).forEach(([filename, fileObj]) => {
        content += `\r\n- ${filename}    ${fileObj.size()}b`
      })
      content += `\r\n\r\n>文件总个数    ${Object.entries(assets).length} 个`
      compilation.assets[this.filename] = {
        source() {
          return content
        },
        size() {
          return content.length
        },
      }
    })
  }
}
module.exports = SyncPlugin


// 执行 npx webpack
// 生成 dist/r.md 文件
// 内容：
/*
# 文件名    文件大小

- main.css    248b
- bundle.js    3297b
- index.html    275b

>文件总个数    3 个
*/
```

### tapAsync-串行等待 & tapPromise：[plugins/SyncPlugin.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/plugins/SyncPlugin.js)

```js
compiler.hooks.emit.tapAsync('SyncPlugin', (compilation, cb) => {
  setTimeout(() => {
    console.log('tapAsync 串行等待中...')
    cb()
  }, 1000)
})
compiler.hooks.emit.tapPromise('SyncPlugin', () => new Promise((resolve) => {
  setTimeout(() => {
    console.log('tapPromise 等待中...')
    resolve()
  }, 1000)
}))
```

- SyncPlugin 在 webpack.config.js 中位置提前会导致 index.html 读取不到，所以 SyncPlugin 需要等待 html-webpack-plugin 完成后执行

## 3、Webpack-InlineSourcePlugin-内联 webpack 插件（使 css 与 js 直接放入 index.html）

- [webpack 插件文档](https://www.npmjs.com/package/html-webpack-plugin) > 搜索 "MyPlugin"

### 新建 InlineSourcePlugin.js: [plugins/InlineSourcePlugin.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/plugins/InlineSourcePlugin.js)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

class MyPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('MyPlugin', (compilation) => {
      console.log('The compiler is starting a new compilation...')

      // Static Plugin interface |compilation |HOOK NAME | register listener
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'MyPlugin', // <-- Set a meaningful name here for stacktraces
        (data, cb) => {
          // Manipulate the content
          data.html += 'The Magic Footer'
          // Tell webpack to move on
          cb(null, data)
        },
      )
    })
  }
}

module.exports = MyPlugin

```

### webpack.config.js 引入 InlineSourcePlugin.js：[webpack.config.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/webpack.config.js)

```js
const InlineSourcePlugin = require('./plugins/InlineSourcePlugin')

new InlineSourcePlugin(),

// 执行：npx webpack
// dist/index.html 中最后新增了 The Magic Footer
```

### 内联 js 与 css[plugins/InlineSourcePlugin.js](./../file/4_webpack/4_project_plugin/1_webpack_plugin/plugins/InlineSourcePlugin.js)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

class InlineSourcePlugin {
  constructor({ match }) {
    /** @type {RegExp} */
    this.match = match
  }

  processTags(data, compilation) {
    data.html = data.html.replace(/<script.*?>[\\s.]*?<\/script>/, (scriptContent) => {
      const content = scriptContent.match(/src="(.+?)"/)[1]
      const script = `<script>${compilation.assets[content].source()}</script>`
      delete compilation.assets[content]
      return script
    })
    data.html = data.html.replace(/<link.*?>/, (styleContent) => {
      const content = styleContent.match(/href="(.+?)"/)[1]
      const style = `<style>${compilation.assets[content].source()}</style>`
      delete compilation.assets[content]
      return style
    })
    return { ...data }
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InlineSourcePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InlineSourcePlugin',
        (data, cb) => {
          data = this.processTags(data, compilation)
          cb(null, data)
        },
      )
    })
  }
}

module.exports = InlineSourcePlugin

// webpack.config.js
// new InlineSourcePlugin({
//   match: /\.(js|css)$/,
// }),

```
