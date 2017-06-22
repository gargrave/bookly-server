'use strict'

const ApiRoute = require('./basic')

const knex = require('../../database/db')
const helpers = require('../utils/routeHelpers')

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
      const ownerId = helpers.getOwnerIdOrDieTrying(request, reply)

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
