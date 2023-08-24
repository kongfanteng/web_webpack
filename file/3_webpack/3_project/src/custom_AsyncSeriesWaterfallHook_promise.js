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
