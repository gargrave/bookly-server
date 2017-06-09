'use strict'

const Boom = require('boom')

const ApiRoute = require('./basic').ApiRoute
const APIRoute = require('./basic').APIRoute

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

class ApiCreateRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({ method: 'POST', path, auth })
    this.db = db
    this.resourceName = resourceName
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

function APICreateRoute ({ path, db, resourceName, auth }) {
  APIRoute.call(this, 'POST', path, auth)

  this.config.handler = (request, reply) => {
    this.buildPayload(request.payload)
      .then(data => {
        knex(db)
          .insert(data)
          .returning(this.getSelectCols())
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

module.exports = {
  ApiCreateRoute,
  APICreateRoute
}
