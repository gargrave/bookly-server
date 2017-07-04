'use strict'

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')
const knex = require('../../../database/db')

const apiErr = require('../../utils/apiErrors')

const bookHelpers = require('./book-helpers')

const resourceName = 'Book'

module.exports = {
  /**
   * Attempts to CREATE a new Book record based on the provided data.
   *
   * Payload should look like:
   *    - owner_id - The ID of the User creating the Book
   *    - title - The title of the Book to create
   *    - author_id - The ID of the Author tied to this Book
   */
  async createBook ({ payload, returning }) {
    let res = Boom.badRequest(apiErr.failedToCreate(resourceName))

    try {
      const bookRecord = await knex(DB.BOOKS)
        .insert(payload)
        .returning(returning)

      // HACK: This is a hack to rebuild the response with full author data,
      // as I could not initially figure out how to get Knex to do a
      // JOIN and RETURNING clause at the same time
      const authorRecord = await this.selectAuthorForBook(payload.owner_id, payload.author_id)
      if (bookRecord.length && authorRecord.length) {
        res = bookHelpers.populateAuthor(Object.assign({},
          bookRecord[0],
          authorRecord[0])
        )
      }
    } catch (err) {
      env.error(err, 'bookQueries.createBook()')

      const msg = err.message || ''
      // check if this is 'unique constaint' error
      if (msg.indexOf('violates unique constraint') !== -1) {
        res = Boom.badRequest(apiErr.matchingRecord(resourceName))
      }
    }

    return res
  },

  /**
   * Attempts to SELECT the book specified by recordId, and INNER JOIN the Author
   * specified by the Book's 'author_id' field.
   */
  async selectBookAndPopulateAuthor ({ ownerId, recordId, selectCols }) {
    let res = Boom.badRequest(apiErr.notFound(resourceName, recordId))

    const where = {
      [`${DB.BOOKS}.owner_id`]: ownerId,
      [`${DB.BOOKS}.id`]: recordId
    }

    try {
      const bookRecord = await knex(DB.BOOKS)
        .select(selectCols)
        .innerJoin(DB.AUTHORS, `${DB.BOOKS}.author_id`, `${DB.AUTHORS}.id`)
        .where(where)
        .limit(1)

      if (bookRecord.length) {
        res = bookHelpers.populateAuthor(bookRecord[0])
      }
    } catch (err) {
      env.error(err, 'bookQueries.createBook()')
    }

    return res
  },

  /**
   * Attempts to SELECT the specified Author record and structure in a fashion
   * appropriate to be nested within a Book object for the HTTP response.
   *
   * @param {*} ownerId - The Book/Author's owner ID
   * @param {*} authorId - The ID of the Author record to SELECT
   */
  async selectAuthorForBook (ownerId, authorId) {
    let res = Boom.badRequest(apiErr.notFound('Author'))

    const select = ['id as author_id', 'first_name', 'last_name']
    const where = {
      [`${DB.AUTHORS}.owner_id`]: ownerId,
      [`${DB.AUTHORS}.id`]: authorId
    }

    try {
      let authorRecord = await knex(DB.AUTHORS)
        .select(select)
        .where(where)
        .limit(1)

      if (authorRecord.length) {
        res = authorRecord
      }
    } catch (err) {
      env.error(err, 'bookQueries.selectAuthorForBook()')
    }

    return res
  }
}