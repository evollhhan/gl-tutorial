const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackConfig = require('./webpack.conf')

// 本地开发端口
const port = process.env.npm_config_port
  ? parseInt(process.env.npm_config_port, 10)
  : 20001
// 第一次打包后自动开启页面
const autoOpenBrowser = true

const app = express()
const compiler = webpack(webpackConfig)
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
app.use(hotMiddleware)
app.use(require('connect-history-api-fallback')())
app.use(devMiddleware)
const distPath = path.resolve(__dirname, '../dist')
app.use('/dist', express.static(distPath))
const staticPath = path.resolve(__dirname, '../docs')
app.use('/docs', express.static(staticPath))
const uri = 'http://localhost:' + port

var _resolve
var _reject
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
var portfinder = require('portfinder')
portfinder.basePort = port

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  portfinder.getPort((err, port) => {
    if (err) {
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser) { opn(uri) }
    server = app.listen(port)
    _resolve()
  })
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}