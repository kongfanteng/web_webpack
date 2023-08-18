import url from './wx.jpg'
// file-loader 的作用，1、会帮你生成一个文件放到 dist 目录下；2、返回拷贝的路径
let img = new Image()
img.src = url
document.body.appendChild(img)
