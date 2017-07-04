'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
const knex = require('../../../database/db')
const helpers = require('../utils/bookRouteHelpers')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

class BookDetailRoute extends ApiDetailRoute {
  constructor () {
    super(params)
  }

  /*
   * Override of the handler builder to run a JOIN command on the Author data.
   */
  getHandler () {
    return (request, reply) => {
      const ownerId = request.auth.credentials.id
      if (!ownerId || !Number.isInteger(ownerId)) {
        reply(Boom.unauthorized())
      }

      const id = request.params.id

      knex(this.db)
        .select(this.getSelectParams())
        .innerJoin(DB.AUTHORS, `${DB.BOOKS}.author_id`, `${DB.AUTHORS}.id`)
        .where({
          [`${DB.BOOKS}.owner_id`]: ownerId,
          [`${DB.BOOKS}.id`]: request.params.id
        })
        .limit(1)
        .then(result => {
          if (!result.length) {
            return reply(Boom.notFound(apiErr.notFound(this.resourceName, id)))
          }
          reply(helpers.populateAuthor(result[0]))
        })
    }
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new BookDetailRoute().buildRoute()
