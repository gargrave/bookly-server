'use strict'

const Boom = require('boom')

const APIRoute = require('./basic')

const knex = require('../../database/db')

function APIListRoute ({ path, db, resourceName, auth }) {
  APIRoute.call(this, 'GET', path, auth)

  this.config.handler = (request, reply) => {
    const ownerId = request.auth.credentials.id
    if (!ownerId || !Number.isInteger(ownerId)) {
      reply(Boom.unauthorized())
    }

    knex(db)
      .select(this.getSelectCols())
      .where('ownerId', ownerId)
        .then(results => {
          reply(results)
        })
  }
}
APIListRoute.prototype = Object.create(APIRoute.prototype)

module.exports = APIListRoute
