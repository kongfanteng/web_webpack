#! /usr/bin/env node

const path = require('path')
// 以当前的执行目录产生一个绝对路径
const configPath = path.resolve('webpack.config.js')
// 自动引用 webpack 配置
const config = require(configPath)

// 通过此配置文件打包
const Compiler = require('../src/Compiler')
// 实例化打包器
const compiler = new Compiler(config)
// 开始打包
compiler.run()
