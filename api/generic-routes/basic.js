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

APIRoute.prototype.pre = function (pre) {
  this.config.pre = pre
  return this
}

APIRoute.prototype.validate = function (validate) {
  this.config.validate = validate
  return this
}

module.exports = APIRoute
