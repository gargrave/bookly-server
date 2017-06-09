'use strict'

const ApiRoute = require('./basic').ApiRoute

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')

class ApiUpdateRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: ['PUT', 'PATCH'],
      path: `${path}/{id}`,
      auth
    })
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

      this.buildPayload(request.payload)
        .then(data => {
          knex(this.db)
            .where({ id, ownerId })
            .update(data)
            .returning(this.getSelectParams())
              .then(result => {
                reply(result[0])
              }, err => {
                console.log(err)
                reply(Boom.badRequest(apiErr.failedToUpdate(this.resourceName)))
              })
        }, err => {
          console.log(err)
          reply(Boom.badRequest(apiErr.failedToUpdate(this.resourceName)))
        })
    }
  }

  /**
   * Override to do the following:
   *    - Update the 'updated_at' prop to use NOW()
  */
  buildPayload (payload) {
    return new Promise((resolve, reject) => {
      resolve(Object.assign(
        {},
        payload,
        { updated_at: knex.raw('NOW()') }
      ))
    })
  }
}

module.exports = ApiUpdateRoute
