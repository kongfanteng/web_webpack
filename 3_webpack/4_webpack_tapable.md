# Webpack-Tapable

## 1、自定义 SyncBailHook

- [src/custom_SyncBailHook.js](./../file/3_webpack/3_project/src/custom_SyncBailHook.js)

```js
// const { SyncBailHook } = require('tapable')

class SyncBailHook {
  constructor(args) {
    this.tasks = []
    this.args = args || []
  }

  tap(name, cb) {
    this.tasks.push(cb)
  }

  call(...args) {
    const argss = args.slice(0, this.args.length)
    let index = 0
    let r;

    do {
      r = this.tasks[index](...argss);
      index += 1
    } while (r === undefined && index !== this.tasks.length);
  }
}

const hook = new SyncBailHook(['x']) // [] 限制当前传递参数个数
hook.tap('吃饭', (option) => {
  console.log(`吃饭后开始：${option}`)
})
hook.tap('睡觉', (option) => {
  console.log(`睡觉后开始：${option}`)
})
hook.call('干活')
// 打印：
// 吃饭后开始：干活
// 睡觉后开始：干活

```

## 2、自定义 SyncLoopHook

- [src/custom_SyncLoopHook.js](./../file/3_webpack/3_project/src/custom_SyncLoopHook.js)

```js
// const { SyncLoopHook } = require('tapable')

class SyncLoopHook {
  constructor(args) {
    this.tasks = []
    this.args = args || []
  }

  tap(name, cb) {
    this.tasks.push(cb)
  }

  call(...args) {
    const argss = args.slice(0, this.args.length)
    this.tasks.forEach((task) => {
      let r;
      do {
        r = task(...argss)
      } while (r !== undefined)
    })
  }
}

const hook = new SyncLoopHook(['x'])
let index = 0
hook.tap('吃饭', (a) => {
  console.log('吃饭:', a)
  return index++ === 3 ? undefined : false
})
hook.tap('睡觉', (a) => {
  console.log('睡觉:', a)
})
hook.call('hello')
// 打印
// 吃饭: hello
// 吃饭: hello
// 吃饭: hello
// 吃饭: hello
// 睡觉: hello

```

## 3、自定义 SyncWaterfallHook

- [src/custom_SyncWaterfallHook.js](./../file/3_webpack/3_project/src/custom_SyncWaterfallHook.js)

```js
// const { SyncWaterfallHook } = require('tapable')

class SyncWaterfallHook {
  constructor(args) {
    this.tasks = []
    /** @type {Array} args */
    this.args = args || []
  }

  tap(name, cb) {
    this.tasks.push(cb)
  }

  call(...args) {
    const argss = args.slice(0, this.args.length)
    const first = this.tasks.shift() // 第一个的输出为第二个的输入
    this.tasks.reduce((a, b) => b(a), first(...argss))
  }
}

const hook = new SyncWaterfallHook(['x', 'x', 'x'])
hook.tap('吃饭', (...a) => {
  console.log('吃饭', ...a)
  return 100
})
hook.tap('睡觉', (a) => {
  console.log('睡觉:', a)
  return a + 100
})
hook.tap('睡觉', (a) => {
  console.log('睡觉:', a)
})
hook.call('hello', 'world', '!')
// 打印
// 吃饭 hello world !
// 睡觉: 100
// 睡觉: 200

```

## 4、自定义 AsyncParallelHook

- [src/custom-AsyncParallelHook.js](./../file/3_webpack/3_project/src/custom-AsyncParallelHook.js)

```js
// const { AsyncParallelHook } = require('tapable')

class AsyncParallelHook {
  constructor(args) {
    this.tasks = []
    /** @type {Array} args */
    this.args = args || []
  }

  tapAsync(name, cb) {
    this.tasks.push(cb)
  }

  callAsync(...args) {
    const lastFn = args.pop()
    const argss = args.slice(0, this.args.length)
    let index = 0
    const done = () => {
      if (++index === this.tasks.length) {
        lastFn()
      }
    } // Promise.all 原理
    this.tasks.forEach((task) => {
      task(done)
    })
  }
}

const hook = new AsyncParallelHook()
hook.tapAsync('吃饭', (cb) => {
  setTimeout(() => {
    console.log(1)
    cb()
  }, 1000);
})
hook.tapAsync('睡觉', (cb) => {
  setTimeout(() => {
    console.log(2)
    cb()
  }, 1000);
})
hook.callAsync(() => { // Promise.all
  console.log('ok')
})
// 打印
// 1
// 2
// ok

```

- tap + call 同步
- tap + callAsync 回调立即执行
- tapAsync + callAsync
- tapPromise + promise

- [src/use-AsyncParallelHook-promise.js](./../file/3_webpack/3_project/src/use-AsyncParallelHook-promise.js)

```js
const { AsyncParallelHook } = require('tapable')

const hook = new AsyncParallelHook()
hook.tapPromise('吃饭', () => new Promise((resolve, _) => {
  setTimeout(() => {
    console.log(1)
    // reject(new Error('hello'))
    resolve('hello')
  }, 1000);
}))
hook.tapPromise('睡觉', () => new Promise((resolve, _) => {
  setTimeout(() => {
    console.log(2)
    resolve()
  }, 1000);
}))
hook.promise().then(() => { // 异步调用
  console.log('all')
}).catch(
  /** @param {Error} e */
  (e) => {
    console.log('error:', e.message)
  },
)
// 打印
// 1
// 2
// all

```

## 5、自定义 AsyncSeriesHook

- [src/custom-AsyncSeriesHook.js](./../file/3_webpack/3_project/src/custom-AsyncSeriesHook.js)

```js
// const { AsyncSeriesHook } = require('tapable')

class AsyncSeriesHook {
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

const hook = new AsyncSeriesHook()
hook.tapPromise('吃饭', () => new Promise((resolve, _) => {
  setTimeout(() => {
    console.log(1)
    // reject(new Error('hello'))
    resolve('hello')
  }, 1000);
}))
hook.tapPromise('睡觉', () => new Promise((resolve, _) => {
  setTimeout(() => {
    console.log(2)
    resolve()
  }, 1000);
}))
hook.promise().then(() => { // 异步调用
  console.log('all')
}).catch(
  /** @param {Error} e */
  (e) => {
    console.log('error:', e.message)
  },
)
// 打印
// 1
// 2
// all

```
