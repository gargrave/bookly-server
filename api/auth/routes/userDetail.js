'use strict'

const Boom = require('boom')

const APIRoute = require('../../generic-routes/basic')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const apiErr = require('../../utils/apiErrors')

function UserDetailRoute () {
  APIRoute.call(this, 'GET', 'auth/users')

  this.config.handler = (request, reply) => {
    const ownerId = request.auth.credentials.id
    if (!ownerId || !Number.isInteger(ownerId)) {
      reply(Boom.unauthorized())
    }

    const id = request.params.id

    knex(DB.USERS)
      .select(this.getQueryCols())
      .where({ 'id': ownerId })
      .limit(1)
      .then(result => {
        if (!result.length) {
          return reply(Boom.notFound(apiErr.notFound('User', id)))
        }
        reply(result[0])
      })
  }
}
UserDetailRoute.prototype = Object.create(APIRoute.prototype)

UserDetailRoute.prototype.getQueryCols = function () {
  return ['id', 'email', 'created_at', 'updated_at']
}

module.exports = new UserDetailRoute()
