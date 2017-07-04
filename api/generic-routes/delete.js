'use strict'

const ApiRoute = require('./basic')

const globalHelpers = require('../utils/routeHelpers')

const queries = require('./utils/generic-queries')

class ApiDeleteRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: 'DELETE',
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
   * Returns the query to use for SELECT before the DELETE query is run.
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

  /**
   * Returns the query to use for the DELETE operate.
   * By default, this simply returns the generic "DELETE" query, but it
   * can be overridden by a child class if it needs to provide a customized version.
   */
  getDeleteQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const recordId = request.params.id
    const params = {
      ownerId,
      recordId,
      dbName: this.db,
      resourceName: this.resourceName
    }

    return queries.delete(params)
  }

  async query (request, reply) {
    const selectResult = await this.getSelectQuery(request, reply)
    const deleteResult = await this.getDeleteQuery(request, reply)
    // if we get nothing back from del(), everything went okay
    return deleteResult !== null ? deleteResult : selectResult
  }
}

module.exports = ApiDeleteRoute
