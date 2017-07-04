'use strict'

const ApiRoute = require('./basic')

const helpers = require('../utils/routeHelpers')

const queries = require('./utils/generic-queries')

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
      this.query(request, reply).then(res => reply(res))
    }
  }

  /**
   * Returns the query to use for the SELECT operation.
   * By default, this simply returns the generic "SELECT all" query, but it
   * can be overridden by a child class if it needs to provide a customized version.
   */
  getSelectQuery (request, reply) {
    const ownerId = helpers.getOwnerIdOrDieTrying(request, reply)
    const params = {
      ownerId,
      selectCols: this.getSelectParams(),
      dbName: this.db
    }

    return queries.selectAll(params)
  }

  async query (request, reply) {
    let result = await this.getSelectQuery(request, reply)
    return result
  }
}

module.exports = ApiListRoute
