function loader(source) {
  const code = `
    let style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(source)}
    document.head.appendChild(style)
  `
  return code
}
module.exports = loader
