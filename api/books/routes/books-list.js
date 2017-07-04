'use strict'

const ApiListRoute = require('../../generic-routes/list')

const globalHelpers = require('../../utils/routeHelpers')

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
  getSelectQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const params = {
      ownerId,
      selectCols: this.getSelectParams(),
      limit: 50
    }

    return queries.selectBookAndPopulateAuthor(params)
  }
}

module.exports = new BooksListRoute().buildRoute()
