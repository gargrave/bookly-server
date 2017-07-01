'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')
const helpers = require('../utils/routeHelpers')

class ApiUpdateRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: ['PUT', 'PATCH'],
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

      this.buildPayload(request.payload)
        .then(data => {
          this.query(id, ownerId, data).then(res => reply(res))
        }, err => {
          console.log(err)
          reply(Boom.badRequest(apiErr.failedToUpdate(this.resourceName)))
        })
    }
  }

  /**
   * Override to do the following:
   *    - Update the 'updated_at' prop to use NOW()
   */
  buildPayload (payload) {
    return new Promise((resolve, reject) => {
      resolve(Object.assign(
        {},
        payload,
        { updated_at: knex.raw('NOW()') }
      ))
    })
  }

  /**
   * Runs all necessary queries and returns either error or data.
   *
   * @param {Object} data The payload data for the create request
   */
  async query (id, ownerId, data) {
    let result = await this.runUpdateQuery({ id, ownerId }, data)
    return result
  }

  /**
   * Runs a SELECT query before the resource is deleted. This way we can
   * have the original data to return AFTER it has been deleted.
   *
   * @param {Object} where The data to use for the WHERE clause
   * @param {Object} data The payload data for the create request
   */
  async runUpdateQuery (where, data) {
    let val = Boom.badRequest(apiErr.failedToUpdate(this.resourceName))

    await knex(this.db)
      .where(where)
      .update(data)
      .returning(this.getSelectParams())
        .then(res => {
          if (res.length) {
            val = res[0]
          }
        })

    return val
  }
}

module.exports = ApiUpdateRoute
