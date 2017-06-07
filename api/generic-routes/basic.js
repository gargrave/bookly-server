'use strict'

const Boom = require('boom')

function APIRoute (method, path, auth) {
  this.method = method
  this.path = `/api/v1/${path}`

  auth = (auth === undefined) ? 'jwt' : auth
  if (auth !== 'jwt') {
    console.log('no auth: ' + path)
  }

  this.config = {
    auth,
    cors: {
      origin: process.env.CORS_WHITELIST.split('|')
    },
    handler: (request, reply) => {
      reply(Boom.notImplemented('Route handler not implemented.'))
    }
  }
}

// chainable function to assign route prerequisites object
APIRoute.prototype.pre = function (pre) {
  this.config.pre = pre
  return this
}

// chainable function to assign route validation object
APIRoute.prototype.validate = function (validate) {
  this.config.validate = validate
  return this
}

/*
Optional overridable function to allow a route to define a specific
set of columns for a SELECT query.
Defaults to all cols.
*/
APIRoute.prototype.getQueryCols = function () {
  return '*'
}

/*
Optional overridable function to allow a route to customize
a payload between the time it is validated and the time it is sent to DB.

e.g. remove an extra 'password confirm' field from register route

Note that it must a return a Promise.
*/
APIRoute.prototype.buildPayload = function (payload) {
  return Promise.resolve(payload)
}

module.exports = APIRoute
