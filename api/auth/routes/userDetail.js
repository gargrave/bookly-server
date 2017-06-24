'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const apiErr = require('../../utils/apiErrors')
const globalHelpers = require('../../utils/routeHelpers')
const helpers = require('../utils/authRouteHelpers')

const params = {
  method: 'GET',
  path: 'auth/users',
  db: DB.USERS,
  resourceName: 'User'
}

class UserDetailRoute extends ApiRoute {
  constructor () {
    super(params)
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
      const id = request.params.id

      this.query(id, ownerId).then(res => reply(res))
    }
  }

  async query (id, ownerId) {
    let result = await this.runSelectQuery(id, ownerId)
    return result
  }

  async runSelectQuery (id, ownerId) {
    let val = Boom.notFound(apiErr.notFound(this.resourceName, id))

    await knex(this.db)
      .select(this.getSelectParams())
      .where({ 'id': ownerId })
      .limit(1)
      .then(res => {
        if (res.length) {
          val = res[0]
        }
      })

    return val
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new UserDetailRoute().buildRoute()
