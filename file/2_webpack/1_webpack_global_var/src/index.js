// eslint-disable-next-line import/no-webpack-loader-syntax
require('expose-loader?exposes=$,jQuery!jquery')

console.log('window.$:', window.$)
/* global $ */
console.log('$:', $)
