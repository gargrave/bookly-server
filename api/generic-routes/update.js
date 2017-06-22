'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')
const helpers = require('../utils/routeHelpers')

class ApiUpdateRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: ['PUT', 'PATCH'],
      path: `${path}/{id}`,
      auth,
      db,
      resourceName
    })
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = helpers.getOwnerIdOrDieTrying(request, reply)
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
