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
