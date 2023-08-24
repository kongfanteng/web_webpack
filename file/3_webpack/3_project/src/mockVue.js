const { SyncHook } = require('tapable')
/**
 * @typedef {Object} Options
 * @property {Function} beforeCreate
 * @property {Function} mounted
 * {@link https://jsdoc.bootcss.com/tags-typedef}
 */
class MyLibrary {
  /**
   * @constructor
   * @param {Options} options
   */
  constructor(options) {
    this.hook = {
      beforeCreate: new SyncHook(),
      mounted: new SyncHook(),
    }
    if (options.beforeCreate) {
      this.hook.beforeCreate.tap('传入的创建前', () => {
        options.beforeCreate()
      })
    }
    if (options.mounted) {
      this.hook.mounted.tap('传入的创建前', () => {
        options.mounted()
      })
    }
  }

  start() {
    // 开始运行时 -> 开始创建
    this.hook.beforeCreate.call()
    console.log('DoSomething...: 中')
    this.hook.mounted.call()
  }
}

const mb = new MyLibrary({
  beforeCreate() {
    console.log('beforeCreate: 前')
  },
  mounted() {
    console.log('mounted: 后')
  },
})

mb.hook.beforeCreate.tap('自定义扩展', () => {
  console.log('beforeCreate 自定义扩展: 创建前')
})

mb.hook.mounted.tap('自定义扩展', () => {
  console.log('mounted 自定义扩展: 创建后')
})

mb.start()
