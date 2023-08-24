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
