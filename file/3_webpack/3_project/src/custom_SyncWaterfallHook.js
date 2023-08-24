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
// 吃饭 hello
// 睡觉: 100
// 睡觉: 200
