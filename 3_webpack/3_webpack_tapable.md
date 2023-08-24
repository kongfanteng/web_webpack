# Webpack-Tapable

## 1、tapable 说明

- tapable 包公开了许多 Hook 类，这些类可以用来为插件创建钩子。
- [tapable github 地址](https://github.com/webpack/tapable#tapable)

```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tapable')
```

## 2、使用 tapable

- 安装依赖包 `yarn add tapable`

- [src/test.js](./../file/3_webpack/3_project/src/test.js)

```js
const { SyncHook } = require('tapable')

const sh = new SyncHook(['xxx']) // 当前钩子的参数
sh.tap('开始编译', (a) => {
  console.log('开始编译:', a)
})
sh.tap('结束编译', (a) => {
  console.log('结束编译:', a)
})
sh.call('hello') // 打印：'开始编译: hello'; '结束编译: hello';

```

## 3、mockVue

- [src/mockVue.js](./../file/3_webpack/3_project/src/mockVue.js)

```js
const { SyncHook } = require('tapable')
/**
 * @typedef {Object} Options
 * @property {Function} beforeCreate
 * @property {Function} mounted
 * {@link https://jsdoc.bootcss.com/tags-typedef}
 */
class MyLibrary {
  /**
   * @constructor
   * @param {Options} options
   */
  constructor(options) {
    this.hook = {
      beforeCreate: new SyncHook(),
      mounted: new SyncHook(),
    }
    if (options.beforeCreate) {
      this.hook.beforeCreate.tap('传入的创建前', () => {
        options.beforeCreate()
      })
    }
    if (options.mounted) {
      this.hook.mounted.tap('传入的创建前', () => {
        options.mounted()
      })
    }
  }

  start() {
    // 开始运行时 -> 开始创建
    this.hook.beforeCreate.call()
    console.log('DoSomething...: 中')
    this.hook.mounted.call()
  }
}

const mb = new MyLibrary({
  beforeCreate() {
    console.log('beforeCreate: 前')
  },
  mounted() {
    console.log('mounted: 后')
  },
})

mb.start() // tapable 流程控制

```

## 4、自定义扩展

- [src/mockVue.js](./../file/3_webpack/3_project/src/mockVue.js)

```js
mb.hook.beforeCreate.tap('自定义扩展', () => {
  console.log('beforeCreate 自定义扩展: 创建前')
})

mb.hook.mounted.tap('自定义扩展', () => {
  console.log('mounted 自定义扩展: 创建后')
})

// 打印
// beforeCreate: 前
// beforeCreate 自定义扩展: 创建前
// DoSomething...: 中
// mounted: 后
// mounted 自定义扩展: 创建后
```

## 5、自定义 SyncHook

- [src/custom_SyncHook.js](./../file/3_webpack/3_project/src/custom_SyncHook.js)

```js
class SyncHook {
  constructor() {
    this.tasks = []
  }

  tap(name, cb) {
    this.tasks.push(cb)
  }

  call() {
    this.tasks.forEach((task) => task())
  }
}
hook.tap('吃饭', () => {
  console.log(`吃饭`)
})
hook.tap('睡觉', (option) => {
  console.log(`睡觉`)
})
hook.call('干活', 'xxx')
// 打印：
// 吃饭
// 睡觉
```
