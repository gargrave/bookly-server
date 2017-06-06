'use strict'

const Hapi = require('hapi')
const Blipp = require('blipp')

const server = new Hapi.Server()

const config = require('./config')
const routes = require('./api/routes')

// run dev script to set up env. vars for dev environment
if (process.env.NODE_ENV === 'dev') {
  require('./scripts/env/dev')
}

function validate (decoded, request, callback) {
  callback(null, true)
}

server.connection(config.server)

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

server.register({ register: Blipp, options: {} }, (err) => {
  if (err) {
    console.log('Error loading Blipp: ' + err)
  }
})

server.start(err => {
  if (err) {
    throw err
  }
  console.log(`Server listening at ${server.info.uri}`)
})
