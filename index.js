'use strict'

const Hapi = require('hapi')
const Blipp = require('blipp')

const server = new Hapi.Server()

server.connection({
  port: process.env.port || 3001,
  routes: {
    cors: {
      origin: ['*']
    }
  }
})

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
