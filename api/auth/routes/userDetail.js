'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const apiErr = require('../../utils/apiErrors')
const helpers = require('../../utils/routeHelpers')

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
      const ownerId = helpers.getOwnerIdOrDieTrying(request, reply)
      const id = request.params.id

      knex(this.db)
        .select(this.getSelectParams())
        .where({ 'id': ownerId })
        .limit(1)
        .then(result => {
          if (!result.length) {
            return reply(Boom.notFound(apiErr.notFound(this.resourceName, id)))
          }
          reply(result[0])
        })
    }
  }

  getSelectParams () {
    return ['id', 'email', 'created_at', 'updated_at']
  }
}

module.exports = new UserDetailRoute().buildRoute()
