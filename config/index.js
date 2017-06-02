const defaultConfig = require('./default')
const config = require(`./${process.env.NODE_ENV}`) || {}

module.exports = Object.assign({},
  defaultConfig,
  config
)
