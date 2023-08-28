#! /usr/bin/env node

/**
 * Webpack 配置约束
 * @typedef {Object} Config - Webpack 配置约束
 * @property {string} mode - development | production
 * @property {string | object} entry - default: './src/index.js'
 * @property {Output} output - default: { filename: 'bundle.js' }
 * @property {Module} module
 * @property {stirng[]} plugins
 *
 * @typedef {Object} Output
 * @property {string} filename
 * @property {string|undefined} path
 *
 * @typedef {Object} Module
 * @property {{use: string[], test: RegExp}[]} rules
 *
 * */

const path = require('path')
// 以当前的执行目录产生一个绝对路径
const configPath = path.resolve('webpack.config.js')
// 自动引用 webpack 配置
/** @type {Config} */
const config = require(configPath)

// 通过此配置文件打包
const Compiler = require('../src/Compiler')
// 实例化打包器
const compiler = new Compiler(config)

if (Array.isArray(config.plugins)) {
  config.plugins.forEach((plugin) => {
    plugin.apply(compiler)
  })
}

compiler.hooks.entryOption.call()

// 开始打包
compiler.run()
