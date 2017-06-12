'use strict'

const ApiListRoute = require('../../generic-routes/list')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')

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
            reply(this.parseReply(results))
          })
    }
  }

  getSelectParams () {
    return [
      'Books.id', 'title', 'Books.created_at', 'Books.updated_at',
      'authorId', 'Authors.firstName', 'Authors.lastName']
  }

  /*
   * Custom reply parser to build a nice clean 'author' object within the book.
   * The original DB query has all the data, but it is not very presented.
   */
  parseReply (reply) {
    for (let book of reply) {
      // build a cleaner version of the author
      book.author = {
        id: book.authorId,
        name: `${book.firstName} ${book.lastName}`
      }

      // remove the original fields
      delete book.authorId
      delete book.firstName
      delete book.lastName
    }
    return reply
  }
}

module.exports = new BooksListRoute().buildRoute()
