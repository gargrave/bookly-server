'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')

class ApiListRoute extends ApiRoute {
  constructor ({ path, auth, db }) {
    super({
      method: 'GET',
      path,
      auth,
      db
    })
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = request.auth.credentials.id
      if (!ownerId || !Number.isInteger(ownerId)) {
        reply(Boom.unauthorized())
      }

      knex(this.db)
        .select(this.getSelectParams())
        .where({ ownerId })
          .then(results => {
            reply(results)
          })
    }
  }
}

module.exports = ApiListRoute
