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

  async query (request, reply) {
    const queryParams = {
      data: await this.buildPayload(request.payload),
      returning: this.getSelectParams(),
      dbName: this.db,
      resourceName: this.resourceName
    }
    const result = await queries.create(queryParams)
    return result
  }
}

module.exports = ApiCreateRoute
