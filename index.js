'use strict'

const Hapi = require('hapi')
const Blipp = require('blipp')

const server = module.exports = new Hapi.Server()

const config = require('./config')
const routes = require('./api/routes')

function validate (decoded, request, callback) {
  callback(null, true)
}

server.connection(config.server)

// plugin: pagination
const paginationOptions = {
  meta: {
    baseUri: process.env.HOST_BASE_URL || ''
  }
}
server.register({
  register: require('hapi-pagination'),
  options: paginationOptions
}, (err) => {
  if (err) {
    throw err
  }
})

server.register(require('hapi-auth-jwt2'), (err) => {
  if (err) {
    console.log('Error loading hapi-auth-jwt2: ' + err)
  }

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.AUTH_SECRET_KEY,
    validateFunc: validate,
    verifyOptions: {
      algorithms: ['HS256']
    }
  })

  server.auth.default('jwt')

  // setup routes
  routes.forEach(r => server.route(require(r)))
})

// exclude plugins that have no use in 'test' env
if (process.env.NODE_ENV !== 'test') {
  server.register({
    register: Blipp,
    options: {}
  }, (err) => {
    if (err) {
      console.log('Error loading Blipp: ' + err)
    }
  })
}

server.start(err => {
  if (err) {
    throw err
  }
  console.log(`Server listening at ${server.info.uri}`)
})
