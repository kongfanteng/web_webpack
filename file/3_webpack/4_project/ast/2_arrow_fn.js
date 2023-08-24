const babel = require('@babel/core')

const code = 'let fn = (a, b) => a + b'
const r = babel.transform(code, {
  // presets: [
  //   '@babel/preset-env',
  // ],
  plugins: [
    '@babel/plugin-transform-arrow-functions',
  ],
})
console.log('r.code: \r\n', r.code)
// 打印：
// r.code: let fn = function (a, b) {
//   return a + b;
// };
