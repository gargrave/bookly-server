'use strict'

const Boom = require('boom')

class ApiRoute {
  constructor ({ method, path, auth }) {
    this.method = method
    this.path = `/api/v1/${path}`
    this.handler = this.getHandler()

    this.config = {
      // auth defaults to JWT unless otherwise specified
      auth: auth || 'jwt',
      pre: this.getPrerequisites(),
      validate: this.getValidators()
    }
  }

  getHandler () {
    return (request, reply) => {
      reply(Boom.notImplemented('Route handler not implemented.'))
    }
  }

  /**
   * Chainable function to assign route prerequisites object
   * @param {Object[]} value The prerequesities config data (array of objects).
   */
  pre (value) {
    this.config.pre = value
    return this
  }

  /**
   * Chainable function to assign route validation object
   * @param {Object} value The object containing validation specs.
   */
  validate (value) {
    this.config.validate = value
    return this
  }

  /**
   * Optional overridable function to allow a route to define a specific
   * set of columns for a SELECT query.
   * Defaults to all cols.
   */
  getSelectParams () {
    return '*'
  }

   /**
   * Optional overridable function to allow a route to define a specific
   * set of route prerequisites. Should return an array of objects.
   * Defaults to empty array.
   */
  getPrerequisites () {
    return []
  }

  /**
   * Optional overridable function to allow a route to define a specific
   * set of route validations functions. Should return an object.
   * Defaults to empty object.
   */
  getValidators () {
    return {}
  }

  /**
  * Optional overridable function to allow a route to customize
  * a payload between the time it is validated and the time it is sent to DB.
  *
  * e.g. remove an extra 'password confirm' field from register route
  *
  * Note that it must a return a Promise.
  */
  buildPayload (payload) {
    return Promise.resolve(payload)
  }

  /**
   * Builds the actual config object required by Hapi to register a route.
   */
  buildRoute () {
    return {
      method: this.method,
      path: this.path,
      handler: this.handler,
      config: this.config
    }
  }
}

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
APIRoute.prototype.getSelectCols = function () {
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

module.exports = {
  ApiRoute,
  APIRoute
}
