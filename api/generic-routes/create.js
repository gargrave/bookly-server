'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

class ApiCreateRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: 'POST',
      path,
      auth,
      db,
      resourceName
    })
  }

  getHandler () {
    return (request, reply) => {
      this.buildPayload(request.payload)
        .then(data => {
          knex(this.db)
            .insert(data)
            .returning(this.getSelectParams())
              .then(result => {
                reply(result[0])
              }, err => {
                console.error(err)
                reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
              })
        }, err => {
          console.error(err)
          reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
        })
    }
  }
}

module.exports = ApiCreateRoute
