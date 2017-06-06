'use strict'

const APIRoute = require('./basic')

const knex = require('../../database/db')

function APIListRoute ({ path, db, resourceName, auth }) {
  APIRoute.call(this, 'GET', path, auth)

  this.config.handler = (request, reply) => {
    knex.select()
      .from(db)
        .then(results => {
          reply(results)
        })
  }
}
APIListRoute.prototype = Object.create(APIRoute.prototype)

module.exports = APIListRoute
