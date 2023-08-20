// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack')
const express = require('express')
// eslint-disable-next-line import/no-extraneous-dependencies
const middleware = require('webpack-dev-middleware')
const config = require('./webpack.config')

const compiler = webpack(config) // webpack-dev-middleware
const app = express()
app.use(middleware(compiler))
app.get('/user', (req, res) => {
  res.json({ name: 'kft' })
})
app.listen(4000)
