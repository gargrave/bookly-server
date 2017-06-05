'use strict'

const Boom = require('boom')

const APIRoute = require('./basic')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

function APIDetailRoute ({ path, db, resourceName }) {
  APIRoute.call(this, 'GET', `${path}/{id}`)

  this.config = {
    handler: (request, reply) => {
      const id = request.params.id

      knex(db)
        .where('id', id)
        .limit(1)
        .then(result => {
          if (!result.length) {
            return reply(Boom.notFound(apiErr.notFound(resourceName, id)))
          }
          reply(result)
        })
    }
  }
}

APIDetailRoute.prototype = Object.create(APIRoute.prototype)

module.exports = APIDetailRoute
