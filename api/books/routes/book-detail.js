'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')

const apiErr = require('../../utils/apiErrors')

const bookHelpers = require('../utils/book-helpers')

class BookDetailRoute extends ApiDetailRoute {
  constructor () {
    super(bookHelpers.params)
  }

  getSelectParams () {
    return bookHelpers.selectCols
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
          reply(bookHelpers.populateAuthor(result[0]))
        })
    }
  }
}

module.exports = new BookDetailRoute().buildRoute()
