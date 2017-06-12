'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
const prereqs = require('../../utils/prereqs')
const helpers = require('../utils/bookRouteHelpers')
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

class BookCreateRoute extends ApiCreateRoute {
  constructor () {
    super(params)
  }

  getHandler () {
    return (request, reply) => {
      this.buildPayload(request.payload)
        .then(data => {
          knex(this.db)
            .insert(data)
            .returning(this.getSelectParams())
              .then(result => {
                // HACK
                // this is a hack to rebuild the response with full author data,
                // as I could not initially figure out how to get Knex to do a
                // JOIN and RETURNING clause at the same time
                const authorId = data.authorId
                knex(DB.AUTHORS)
                  .select(['firstName', 'lastName', 'id'])
                  .where({
                    [`${DB.AUTHORS}.ownerId`]: data.ownerId,
                    [`${DB.AUTHORS}.id`]: authorId
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
                console.error(err)
                reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
              })
        }, err => {
          console.error(err)
          reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
        })
    }
  }

  getSelectParams () {
    return [
      'id', 'title', 'created_at', 'updated_at', 'authorId'
    ]
  }

  getPrerequisites () {
    return [
      { method: prereqs.populateOwnerId, failAction: 'error' }
    ]
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new BookCreateRoute().buildRoute()
