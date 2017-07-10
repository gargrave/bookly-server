'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')

const apiErr = require('../../utils/api-errors')

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
      const authorSelectResult = await this.selectAuthorForBook(
        payload.owner_id, payload.author_id)

      if (authorSelectResult.length) {
        const bookRecord = await knex(DB.BOOKS)
          .insert(payload)
          .returning(returning)

        if (bookRecord.length) {
          res = bookHelpers.populateAuthor(Object.assign({},
            bookRecord[0],
            authorSelectResult[0])
          )
        }
      } else {
        throw authorSelectResult
      }
    } catch (err) {
      env.error(err, 'bookQueries.createBook()')

      const msg = err.message || ''
      // check if this is 'unique constaint' error
      if (msg.indexOf('violates unique constraint') !== -1) {
        res = Boom.badRequest(apiErr.matchingRecord(resourceName))
      }
      // check if this is 'foreign key' error
      if (msg.indexOf('violates foreign key constraint') !== -1 ||
        msg.indexOf('No Author with id') !== -1) {
        res = Boom.badRequest(apiErr.invalidForeignKey('Author', payload.author_id))
      }
    }

    return res
  },

  /**
   * Attempts to UPDATE an existing Book record based on the provided data.
   */
  async updateBook ({ ownerId, recordId, payload, returning }) {
    let res = Boom.badRequest(apiErr.failedToUpdate(resourceName))

    const where = { owner_id: ownerId, id: recordId }

    try {
      const bookRecord = await knex(DB.BOOKS)
        .where(where)
        .update(payload)
        .returning(returning)

      if (bookRecord.length) {
        const book = bookRecord[0]
        // HACK: This is a hack to rebuild the response with full author data,
        // as I could not initially figure out how to get Knex to do a
        // JOIN and RETURNING clause at the same time
        const authorRecord = await this.selectAuthorForBook(ownerId, book.author_id)
        if (authorRecord.length) {
          res = bookHelpers.populateAuthor(Object.assign({},
            book,
            authorRecord[0])
          )
        }
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
   *
   * Can process both multiple selection (i.e. "list") and single select (i.e. "find").
   * For single selection, the 'recordId' param must be provided.
   * For multiple selection, the 'limit' param must be provided, as it defaults to 1.
   */
  async selectOneBookAndPopulateAuthor ({ ownerId, recordId, selectCols }) {
    let res = Boom.badRequest(apiErr.notFound(resourceName, recordId))

    // build the WHERE clause, with optional record id (i.e. for single selection)
    const where = {
      [`${DB.BOOKS}.owner_id`]: ownerId
    }
    if (recordId) {
      where[`${DB.BOOKS}.id`] = recordId
    }

    try {
      const bookRecords = await knex(DB.BOOKS)
        .select(selectCols)
        .innerJoin(DB.AUTHORS, `${DB.BOOKS}.author_id`, `${DB.AUTHORS}.id`)
        .where(where)
        .limit(1)

      if (bookRecords.length) {
        res = bookHelpers.populateAuthor(bookRecords[0])
      }
    } catch (err) {
      env.error(err, 'bookQueries.createBook()')
    }

    return res
  },

  async selectManyBooksAndPopulateAuthor (params) {
    let res = Boom.badRequest(apiErr.failedToList('Book'))

    const { ownerId, select, limit, offset } = params
    // build the WHERE clause, with optional record id (i.e. for single selection)
    const where = { [`${DB.BOOKS}.owner_id`]: ownerId }

    try {
      const bookRecords = await knex(DB.BOOKS)
        .select(select)
        .innerJoin(DB.AUTHORS, `${DB.BOOKS}.author_id`, `${DB.AUTHORS}.id`)
        .where(where)
        .limit(limit || 50)
        .offset(offset || 0)

      if (bookRecords.length) {
        if (bookRecords.length === 1) {
          // if we get a single record, make sure to wrap it as an Array
          res = [bookHelpers.populateAuthor(bookRecords[0])]
        } else {
          res = bookHelpers.populateAuthor(bookRecords)
        }
      } else {
        // if no records exist, we still need to return an empty array
        res = []
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
    let res = Boom.badRequest(apiErr.notFound('Author', authorId))

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
