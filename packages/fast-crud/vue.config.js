const webpack = require('webpack')
const LimitChunkCountPlugin = new webpack.optimize.LimitChunkCountPlugin({
  maxChunks: 1,
  minChunkSize: 1000
})
const plugins = []
plugins.push(LimitChunkCountPlugin)
let externals = {
  vue: 'Vue',
  'lodash-es': '_'
}
if (process.env.VUE_APP_RUN_DEMO) {
  externals = {}
}
module.exports = {
  css: { extract: false },
  configureWebpack: {
    externals: externals,
    plugins: plugins
  }
}
