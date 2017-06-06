'use strict'

const Boom = require('boom')

function APIRoute (method, path) {
  this.method = method
  this.path = `/api/v1/${path}`

  this.config = {
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

// optional overridable function to allow a route to customize
// a payload between the time it is validated and the time it is sent to DB
// e.g. remove an extra 'password confirm' field from register route
APIRoute.prototype.buildPayload = function (payload) {
  return payload
}

module.exports = APIRoute
