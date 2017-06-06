'use strict'

const Hapi = require('hapi')
const Blipp = require('blipp')

const server = new Hapi.Server()

const config = require('./config')
const routes = require('./api/routes')

function validate (decoded, request, callback) {
  console.log('TODO: Implement validate()')
  let people = { // our "users database"
    1: {
      id: 1,
      name: 'Jen Jones'
    }
  }
  // do your checks to see if the person is valid
  if (!people[decoded.id]) {
    return callback(null, false)
  } else {
    return callback(null, true)
  }
};

server.connection(config.server)

server.register(require('hapi-auth-jwt2'), (err) => {
  if (err) {
    console.log('Error loading hapi-auth-jwt2: ' + err)
  }

  server.auth.strategy('jwt', 'jwt', {
    key: 'NeverShareYourSecret',
    validateFunc: validate, // validate function defined above
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
