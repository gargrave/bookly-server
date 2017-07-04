'use strict'

const ApiRoute = require('./basic')

const helpers = require('../utils/routeHelpers')

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

  async query (request, reply) {
    const ownerId = helpers.getOwnerIdOrDieTrying(request, reply)

    const queryParams = {
      ownerId,
      recordId: request.params.id,
      selectCols: this.getSelectParams(),
      dbName: this.db,
      resourceName: this.resourceName
    }

    let result = await queries.selectOne(queryParams)
    return result
  }
}

module.exports = ApiDetailRoute
