'use strict'

const ApiRoute = require('./basic')

const globalHelpers = require('../utils/route-helpers')

const queries = require('./utils/generic-queries')

const pagination = {
  enabled: true
}

class ApiListRoute extends ApiRoute {
  constructor ({ path, auth, db }) {
    super({
      method: 'GET',
      path,
      auth,
      db,
      pagination
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
  async getSelectQuery (request, reply) {
    // set basic query properties
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const table = this.db
    const select = this.getSelectParams()

    // set pagination properties
    const pag = request.query
    const limit = pag.limit
    const offset = (pag.page * pag.limit) - pag.limit
    const totalCount = await queries.countRows({ ownerId, table })
    request.totalCount = totalCount

    const params = { ownerId, table, select, limit, offset }
    return queries.selectMany(params)
  }

  async query (request, reply) {
    let result = await this.getSelectQuery(request, reply)
    return result
  }
}

module.exports = ApiListRoute
