;(() => {
  // webpackBootstrap
  var __webpack_modules__ = {
    './src/index.js': (
      __unused_webpack_module,
      __unused_webpack_exports,
      __webpack_require__
    ) => {
      // 默认会去调用 require('sum.js')，默认会放回 sum.js 中的 module.exports 的结果
      eval('let sum = __webpack_require__(/*! ./sum */ "./src/sum.js"); console.log(sum(1, 2));\n\n//# sourceURL=webpack://1_webpack/./src/index.js?')
    },

    './src/sum.js': (module) => {
      eval('module.exports = (a,b) => a + b\n\n//# sourceURL=webpack://1_webpack/./src/sum.js?')
    },
  }
  var __webpack_module_cache__ = {}
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId]
    if (cachedModule !== undefined) {
      return cachedModule.exports
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    })
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__)
    return module.exports
  }
  var __webpack_exports__ = __webpack_require__('./src/index.js')
})()
