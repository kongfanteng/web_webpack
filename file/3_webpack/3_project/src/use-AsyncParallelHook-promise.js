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
