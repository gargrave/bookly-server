'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

class ApiCreateRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: 'POST',
      path,
      auth,
      db,
      resourceName
    })
  }

  getHandler () {
    return (request, reply) => {
      this.buildPayload(request.payload)
        .then(data => {
          this.query(data).then(res => reply(res))
        }, err => {
          console.error(err)
          reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
        })
    }
  }

  /**
   * Runs all necessary queries and returns either error or data.
   *
   * @param {Object} data The payload data for the create request
   */
  async query (data) {
    let result = await this.runCreateQuery(data)
    return result
  }

  /**
   * Runs a SELECT query before the resource is deleted. This way we can
   * have the original data to return AFTER it has been deleted.
   *
   * @param {Object} data The payload data for the create request
   */
  async runCreateQuery (data) {
    let val = Boom.badRequest(apiErr.failedToCreate(this.resourceName))

    await knex(this.db)
      .insert(data)
      .returning(this.getSelectParams())
        .then(result => {
          val = result[0]
        })

    return val
  }
}

module.exports = ApiCreateRoute
