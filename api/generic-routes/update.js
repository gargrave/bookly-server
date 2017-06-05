'use strict'

const Boom = require('boom')

const APIRoute = require('./basic')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

function APIUpdateRoute ({ path, db, resourceName }) {
  APIRoute.call(this, ['PUT', 'PATCH'], `${path}/{id}`)

  this.config = {
    handler: (request, reply) => {
      const data = Object.assign({},
        request.payload,
        { updated_at: knex.raw('NOW()') }
      )

      knex(db)
        .where('id', request.params.id)
        .update(data).returning('*')
          .then(result => {
            reply(result)
          }, err => {
            console.log(err)
            reply(Boom.badRequest(apiErr.failedToUpdate(resourceName)))
          })
    }
  }
}

APIUpdateRoute.prototype = Object.create(APIRoute.prototype)

module.exports = APIUpdateRoute
