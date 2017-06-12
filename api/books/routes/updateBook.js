'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
const helpers = require('../utils/bookRouteHelpers')
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

class BookUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(params)
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
                // HACK
                // this is a hack to rebuild the response with full author data,
                // as I could not initially figure out how to get Knex to do a
                // JOIN and RETURNING clause at the same time
                const authorId = result[0].authorId
                knex(DB.AUTHORS)
                  .select(['firstName', 'lastName', 'id'])
                  .where({
                    ownerId,
                    id: authorId
                  })
                  .limit(1)
                  .then(authorResult => {
                    if (!authorResult.length) {
                      return reply(Boom.notFound(apiErr.notFound('Author', authorId)))
                    }
                    reply(helpers.populateAuthor(
                      Object.assign({}, result[0], authorResult[0]))
                    )
                  })
                  // ENDHACK
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

  getSelectParams () {
    return ['id', 'authorId', 'title', 'created_at', 'updated_at']
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new BookUpdateRoute().buildRoute()
