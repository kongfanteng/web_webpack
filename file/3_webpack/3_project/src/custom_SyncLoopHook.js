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
