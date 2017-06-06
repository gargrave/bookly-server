'use strict'

const Boom = require('boom')

const APIRoute = require('./basic')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

function APICreateRoute ({ path, db, resourceName, auth }) {
  APIRoute.call(this, 'POST', path, auth)

  this.config.handler = (request, reply) => {
    this.buildPayload(request.payload)
      .then(data => {
        knex(db)
          .insert(data)
          .returning(this.getQueryCols())
            .then(result => {
              reply(result[0])
            }, err => {
              console.log(err)
              reply(Boom.badRequest(apiErr.failedToCreate(resourceName)))
            })
      }, err => {
        console.log(err)
        reply(Boom.badRequest(apiErr.failedToCreate(resourceName)))
      })
  }
}
APICreateRoute.prototype = Object.create(APIRoute.prototype)

module.exports = APICreateRoute
