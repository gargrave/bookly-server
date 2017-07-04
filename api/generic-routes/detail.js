'use strict'

const ApiRoute = require('./basic')

const globalHelpers = require('../utils/routeHelpers')

const queries = require('./utils/generic-queries')

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
      this.query(request, reply).then(res => reply(res))
    }
  }

  /**
   * Returns the query to use for SELECT operation.
   * By default, this simply returns the generic "SELECT one" query, but it
   * can be overridden by a child class if it needs to provide a customized version.
   */
  getSelectQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const recordId = request.params.id
    const params = {
      ownerId,
      recordId,
      dbName: this.db,
      resourceName: this.resourceName,
      selectCols: this.getSelectParams()
    }

    return queries.selectOne(params)
  }

  async query (request, reply) {
    let result = await this.getSelectQuery(request, reply)
    return result
  }
}

module.exports = ApiDetailRoute
