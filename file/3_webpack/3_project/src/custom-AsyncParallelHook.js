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
