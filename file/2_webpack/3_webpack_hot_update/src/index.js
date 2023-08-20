// const sum = require('./other').default

// console.log('sum:', sum(2, 4))

// const btn = document.createElement('button')
// btn.innerHTML = '点我啊'
// btn.addEventListener('click', () => {
//   const p = document.createElement('p')
//   p.innerHTML = 'hello'
//   window.app.appendChild(p)
// })
// window.app.appendChild(btn)
// if (module.hot) {
//   // 重新干你想干的事
//   module.hot.accept('./other.js', () => {
//     // eslint-disable-next-line global-require
//     const sumx = require('./other').default
//     btn.innerHTML = sumx(1, 2)
//   })
// }

const btn = document.createElement('button')
btn.innerHTML = '点我啊'
btn.addEventListener('click', async () => {
  // const { default: o } = await import('./other')
  // btn.innerHTML = o('a', 'b')
  // import('./other').then(({ default: o }) => {
  //   btn.innerHTML = o('b', 'c')
  // })
  // import(/* webpackChunkName: "video" */'./other').then(({ default: o }) => {
  //   btn.innerHTML = o('b', 'c')
  // })
  import(/* webpackPrefetch: true */'./other').then(({ default: o }) => {
    btn.innerHTML = o('b', 'c')
  })
})
window.app.appendChild(btn)
