'use strict'

const Hapi = require('hapi')
const Blipp = require('blipp')

const server = new Hapi.Server()

const config = require('./config')

server.connection(config.server)

server.register({ register: Blipp, options: {} }, (err) => {
  if (err) {
    console.log('Error loading Blipp: ' + err)
  }
})

server.route(require('./api/authors/routes/listAuthors'))
server.route(require('./api/authors/routes/detailAuthor'))
server.route(require('./api/authors/routes/createAuthor'))

server.start(err => {
  if (err) {
    throw err
  }
  console.log(`Server listening at ${server.info.uri}`)
})
