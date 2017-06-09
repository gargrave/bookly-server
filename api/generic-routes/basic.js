'use strict'

const Boom = require('boom')

class ApiRoute {
  constructor ({ method, path, auth }) {
    this.method = method
    this.path = `/api/v1/${path}`
    this.handler = this.getHandler()

    this.config = {
      // auth defaults to JWT unless otherwise specified
      // NOTE: we do need to explicity check if auth is undefined,
      // because a route with no auth will defined FALSE for auth
      auth: (auth === undefined) ? 'jwt' : auth,
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

module.exports = ApiRoute
