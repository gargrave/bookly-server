'use strict'

const ApiListRoute = require('../../generic-routes/list')

const genericQueries = require('../../generic-routes/utils/generic-queries')
const globalHelpers = require('../../utils/route-helpers')

const bookHelpers = require('../utils/book-helpers')
const queries = require('../utils/book-queries')

class BooksListRoute extends ApiListRoute {
  constructor () {
    super(bookHelpers.params)
  }

  getSelectParams () {
    return bookHelpers.selectCols
  }

  /**
   * Override to use custom Book SELECT method to populate the Author data.
   */
  async getSelectQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const table = this.db
    const select = this.getSelectParams()

    // set pagination properties
    const pag = request.query
    const limit = pag.limit
    const offset = (pag.page * pag.limit) - pag.limit
    const totalCount = await genericQueries.countRows({ ownerId, table })
    request.totalCount = totalCount

    const params = { ownerId, select, limit, offset }
    return queries.selectManyBooksAndPopulateAuthor(params)
  }
}

module.exports = new BooksListRoute().buildRoute()
