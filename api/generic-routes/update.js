'use strict'

const ApiRoute = require('./basic')

const knex = require('../../database/db')

const globalHelpers = require('../utils/route-helpers')

const queries = require('./utils/generic-queries')

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
      this.query(request, reply).then(res => reply(res))
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

  async query (request, reply) {
    let result = await this.getUpdateQuery(request, reply)
    return result
  }

  /**
   * Returns the query to use for the UPDATE operation.
   * By default, this simply returns the generic "UPDATE" query, but it
   * can be overridden by a child class if it needs to provide a customized version.
   */
  async getUpdateQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const recordId = request.params.id
    const data = await this.buildPayload(request.payload)

    const params = {
      ownerId,
      recordId,
      data,
      returning: this.getSelectParams(),
      dbName: this.db,
      resourceName: this.resourceName
    }
    return queries.update(params)
  }
}

module.exports = ApiUpdateRoute
