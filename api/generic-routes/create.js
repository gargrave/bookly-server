'use strict'

const ApiRoute = require('./basic')

const queries = require('./utils/generic-queries')

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
      this.query(request, reply).then(res => reply(res))
    }
  }

  /**
   * Returns the query to use for the CREATE operation.
   * By default, this simply returns the generic "CREATE" query, but it
   * can be overridden by a child class if it needs to provide a customized version.
   */
  async getCreateQuery (request, reply) {
    const data = await this.buildPayload(request.payload)
    const params = {
      data,
      returning: this.getSelectParams(),
      dbName: this.db,
      resourceName: this.resourceName
    }
    return queries.create(params)
  }

  async query (request, reply) {
    const result = await this.getCreateQuery(request, reply)
    return result
  }
}

module.exports = ApiCreateRoute
