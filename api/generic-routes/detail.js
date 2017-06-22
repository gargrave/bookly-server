'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')
const helpers = require('../utils/routeHelpers')

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
      const ownerId = helpers.getOwnerIdOrDieTrying(request, reply)
      const id = request.params.id

      this.query(id, ownerId).then(res => reply(res))
    }
  }

  /**
   * Runs all necessary queries and returns either error or data.
   *
   * @param {*} id The ID nubmer of the record to delete
   * @param {*} ownerId The owner ID of the user making the request
   */
  async query (id, ownerId) {
    let result = await this.runSelectQuery({ id, ownerId })
    return result
  }

  /**
   * Runs a SELECT query before the resource is deleted. This way we can
   * have the original data to return AFTER it has been deleted.
   *
   * @param {Object} where The data to use for the WHERE clause
   */
  async runSelectQuery (where) {
    let val = Boom.badRequest(apiErr.notFound(this.resourceName, where.id))

    await knex(this.db)
      .select(this.getSelectParams())
      .where(where)
      .limit(1)
      .then(res => {
        if (res.length) {
          val = res[0]
        }
      })

    return val
  }
}

module.exports = ApiDetailRoute
