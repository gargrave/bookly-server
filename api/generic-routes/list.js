'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')
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

      this.query(ownerId).then(res => reply(res))
    }
  }

  /**
   * Runs all necessary queries and returns either error or data.
   *
   * @param {*} ownerId The owner ID of the user making the request
   */
  async query (ownerId) {
    let result = await this.runSelectQuery({ owner_id: ownerId })
    return result
  }

  /**
   * Runs a SELECT query before the resource is deleted. This way we can
   * have the original data to return AFTER it has been deleted.
   *
   * @param {Object} where The data to use for the WHERE clause
   */
  async runSelectQuery (where) {
    let val = Boom.badRequest(apiErr.failedToList(this.resourceName))

    await knex(this.db)
      .select(this.getSelectParams())
      .where(where)
        .then(results => {
          val = results
        })

    return val
  }
}

module.exports = ApiListRoute
