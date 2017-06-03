'use strict'

const Hapi = require('hapi')
const Blipp = require('blipp')

const server = new Hapi.Server()

const config = require('./config')
const routes = require('./api/routes')

server.connection(config.server)

server.register({ register: Blipp, options: {} }, (err) => {
  if (err) {
    console.log('Error loading Blipp: ' + err)
  }
})

// setup routes
routes.forEach(r => server.route(require(r)))

server.start(err => {
  if (err) {
    throw err
  }
  console.log(`Server listening at ${server.info.uri}`)
})
