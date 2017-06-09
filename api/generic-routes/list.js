'use strict'

const Boom = require('boom')

const ApiRoute = require('./basic').ApiRoute
const APIRoute2 = require('./basic').APIRoute

const knex = require('../../database/db')

class ApiListRoute extends ApiRoute {
  constructor ({ path, auth, db }) {
    super({ method: 'GET', path, auth })
    this.db = db
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = request.auth.credentials.id
      if (!ownerId || !Number.isInteger(ownerId)) {
        reply(Boom.unauthorized())
      }

      knex(this.db)
        .select(this.getSelectParams())
        .where({ ownerId })
          .then(results => {
            reply(results)
          })
    }
  }
}

function APIListRoute2 ({ path, db, resourceName, auth }) {
  APIRoute2.call(this, 'GET', path, auth)

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
APIListRoute2.prototype = Object.create(APIRoute2.prototype)

module.exports = {
  ApiListRoute,
  APIListRoute2
}
