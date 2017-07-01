'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')
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

  getSelectParams () {
    return helpers.selectCols
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
      this.query(ownerId).then(res => reply(res))
    }
  }

  async query (ownerId) {
    let result = await this.runSelectQuery(ownerId)
    return result
  }

  async runSelectQuery (ownerId) {
    let res = Boom.notFound('No matching User found.')

    try {
      const result = await knex(this.db)
        .select(this.getSelectParams())
        .where({ 'id': ownerId })
        .limit(1)
      res = result[0]
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('Error @ userDetail.runSelectQuery():')
        console.dir(err)
      }
    }

    return res
  }
}

module.exports = new UserDetailRoute().buildRoute()
