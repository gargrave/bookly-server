'use strict'

const ApiListRoute = require('../../generic-routes/list')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const helpers = require('../utils/bookRouteHelpers')

class BooksListRoute extends ApiListRoute {
  constructor () {
    super({
      path: 'books',
      db: DB.BOOKS
    })
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

      knex(this.db)
        .select(this.getSelectParams())
        .innerJoin(DB.AUTHORS, `${DB.BOOKS}.authorId`, `${DB.AUTHORS}.id`)
        .where({ [`${DB.BOOKS}.ownerId`]: ownerId })
          .then(results => {
            reply(helpers.populateAuthor(results))
          })
    }
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new BooksListRoute().buildRoute()
