'use strict'

const Boom = require('boom')

const APIRoute = require('./basic')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

function APIDetailRoute ({ path, db, resourceName }) {
  APIRoute.call(this, 'GET', `${path}/{id}`)

  this.config.handler = (request, reply) => {
    const ownerId = request.auth.credentials.id
    if (!ownerId || !Number.isInteger(ownerId)) {
      reply(Boom.unauthorized())
    }

    const id = request.params.id

    knex(db)
      .select(this.getQueryCols())
      .where({ id, ownerId })
      .limit(1)
      .then(result => {
        if (!result.length) {
          return reply(Boom.notFound(apiErr.notFound(resourceName, id)))
        }
        reply(result[0])
      })
  }
}
APIDetailRoute.prototype = Object.create(APIRoute.prototype)

module.exports = APIDetailRoute
