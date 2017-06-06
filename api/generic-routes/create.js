'use strict'

const Boom = require('boom')

const APIRoute = require('./basic')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

function APICreateRoute ({ path, db, resourceName }) {
  APIRoute.call(this, 'POST', path)

  this.config = {
    handler: (request, reply) => {
      const data = this.buildPayload(request.payload)

      knex(db)
        .insert(data)
        .returning('*')
          .then(result => {
            reply(result)
          }, err => {
            console.log(err)
            reply(Boom.badRequest(apiErr.failedToCreate(resourceName)))
          })
    }
  }
}

APICreateRoute.prototype = Object.create(APIRoute.prototype)

module.exports = APICreateRoute
