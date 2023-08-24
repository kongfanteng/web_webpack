const { SyncHook } = require('tapable')

const sh = new SyncHook(['xxx']) // 当前钩子的参数
sh.tap('开始编译', (a) => {
  console.log('开始编译:', a)
})
sh.tap('结束编译', (a) => {
  console.log('结束编译:', a)
})
sh.call('hello')
