'use strict'

const Boom = require('boom')

const APIRoute = require('./basic')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

function APIUpdateRoute ({ path, db, resourceName }) {
  APIRoute.call(this, ['PUT', 'PATCH'], `${path}/{id}`)

  this.config.handler = (request, reply) => {
    const ownerId = request.auth.credentials.id
    if (!ownerId || !Number.isInteger(ownerId)) {
      reply(Boom.unauthorized())
    }

    const id = request.params.id

    this.buildPayload(request.payload)
      .then(data => {
        knex(db)
          .where({ id, ownerId })
          .update(data)
          .returning(this.getQueryCols())
            .then(result => {
              reply(result[0])
            }, err => {
              console.log(err)
              reply(Boom.badRequest(apiErr.failedToUpdate(resourceName)))
            })
      }, err => {
        console.log(err)
        reply(Boom.badRequest(apiErr.failedToUpdate(resourceName)))
      })
  }
}
APIUpdateRoute.prototype = Object.create(APIRoute.prototype)

/*
Override to do the following:
  - Update the 'updated_at' prop to use NOW()
*/
APIUpdateRoute.prototype.buildPayload = function (payload) {
  return new Promise((resolve, reject) => {
    resolve(Object.assign(
      {},
      payload,
      { updated_at: knex.raw('NOW()') }
    ))
  })
}

module.exports = APIUpdateRoute
