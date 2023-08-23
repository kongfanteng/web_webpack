import _ from 'lodash' // 提高加载速度，可以单独抽离出一个 js
import { sum } from './calc'

console.log('sum():', sum())

// 只对生产环境生效，会干掉 a, b, c, d
const a = 1
const b = 2
const c = 3
const d = a + b + c
console.log('d:', d)

const fn = _.after(1, () => {
  console.log('hello')
})
fn()
