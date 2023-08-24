const { SyncBailHook } = require('tapable')

class SyncBailHook1 {
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

const hook = new SyncBailHook1(['x']) // [] 限制当前传递参数个数
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
