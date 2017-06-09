'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

class ApiDetailRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: 'GET',
      path: `${path}/{id}`,
      auth,
      db,
      resourceName
    })
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = request.auth.credentials.id
      if (!ownerId || !Number.isInteger(ownerId)) {
        reply(Boom.unauthorized())
      }

      const id = request.params.id

      knex(this.db)
        .select(this.getSelectParams())
        .where({ id, ownerId })
        .limit(1)
        .then(result => {
          if (!result.length) {
            return reply(Boom.notFound(apiErr.notFound(this.resourceName, id)))
          }
          reply(result[0])
        })
    }
  }
}

module.exports = ApiDetailRoute
