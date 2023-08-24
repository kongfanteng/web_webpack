# Webpack-Tapable-HomeWork

## 1、作业

- 自定义 AsyncSeriesWaterfallHook + tapAsync + callAsync
- 自定义 AsyncSeriesWaterfallHook + tapPromise + promise

## 2、自定义 AsyncSeriesWaterfallHook + tapAsync + callAsync

- [src/custom_AsyncSeriesWaterfallHook.js](./../file/3_webpack/3_project/src/custom_AsyncSeriesWaterfallHook.js)

```js
// const { AsyncSeriesWaterfallHook } = require('tapable')

class AsyncSeriesWaterfallHook {
  constructor(args) {
    this.tasks = []
    /** @type {Array} args */
    this.args = args || []
  }

  tapAsync(_, cb) {
    this.tasks.push(cb)
  }

  callAsync(...args) {
    const finalCallback = args.pop()
    const argss = args.slice(0, this.args.length)
    let index = 0
    const next = (err, data) => {
      const task = this.tasks[index]
      if (!task) return finalCallback(err, data)
      if (index++ === 0) {
        return task(...argss, next)
      }
      return task(data, next)
    }
    next()
  }
}

const hook = new AsyncSeriesWaterfallHook(['name'])

hook.tapAsync('吃饭', (name, cb) => {
  setTimeout(() => {
    console.log('吃饭：', name)
    cb(null, '3')
  }, 100)
})
hook.tapAsync('睡觉', (name, cb) => {
  setTimeout(() => {
    console.log('睡觉：', name)
    cb(null, '4')
  }, 100)
})
hook.callAsync('123', (...arg) => {
  console.log('ok', ...arg);
})
// 打印
// 吃饭： 123
// 睡觉： 3
// ok null 4

```

## 3、自定义 AsyncSeriesWaterfallHook + tapPromise + promise

- [src/custom_AsyncSeriesWaterfallHook_promise.js](./../file/3_webpack/3_project/src/custom_AsyncSeriesWaterfallHook_promise.js)

```js
// const { AsyncSeriesWaterfallHook } = require('tapable')

class AsyncSeriesWaterfallHook {
  constructor() {
    this.tasks = []
  }

  tapPromise(_, cb) {
    this.tasks.push(cb)
  }

  promise() {
    const firstFn = this.tasks.shift()
    // 需要等待第一个 promise 执行后，执行第二个绑定函数，依次调用
    return this.tasks.reduce((a, b) => a.then(b), firstFn())
  }
}

const hook = new AsyncSeriesWaterfallHook(['name'])

hook.tapPromise('吃饭', () => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('1')
    resolve('hello')
  }, 1000)
}))
hook.tapPromise('睡觉', (a) => new Promise((resolve, reject) => {
  console.log('a:', a)
  setTimeout(() => {
    console.log('2')
    resolve('hello')
  }, 1000)
}))
hook.promise().then((r) => {
  console.log('ok', r);
})
// 打印
// 1
// a: hello
// 2
// ok hello

```

## 5、tapable 使用

- SyncHook
- SyncBaiHook 返回值不为 undefined，就停止
- SyncWaterfallHook 瀑布
- SyncLoopHook
- AsyncParalleHook: tap tapAsync tapPromise ==> call callAsync promise
