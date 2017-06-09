'use strict'

const Boom = require('boom')

const ApiRoute = require('./basic').ApiRoute
const APIRoute = require('./basic').APIRoute

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

class ApiDetailRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({ method: 'GET', path: `${path}/{id}`, auth })
    this.db = db
    this.resourceName = resourceName
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = request.auth.credentials.id
      if (!ownerId || !Number.isInteger(ownerId)) {
        reply(Boom.unauthorized())
      }

      const id = request.params.id

      knex(this.db)
        .select(this.getSelectParams())
        .where({ id, ownerId })
        .limit(1)
        .then(result => {
          if (!result.length) {
            return reply(Boom.notFound(apiErr.notFound(this.resourceName, id)))
          }
          reply(result[0])
        })
    }
  }
}

function APIDetailRoute2 ({ path, db, resourceName }) {
  APIRoute.call(this, 'GET', `${path}/{id}`)

  this.config.handler = (request, reply) => {
    const ownerId = request.auth.credentials.id
    if (!ownerId || !Number.isInteger(ownerId)) {
      reply(Boom.unauthorized())
    }

    const id = request.params.id

    knex(db)
      .select(this.getSelectCols())
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
APIDetailRoute2.prototype = Object.create(APIRoute.prototype)

module.exports = {
  ApiDetailRoute,
  APIDetailRoute2
}
