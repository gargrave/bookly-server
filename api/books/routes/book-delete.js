'use strict'

const ApiDeleteRoute = require('../../generic-routes/delete')

const globalHelpers = require('../../utils/route-helpers')

const bookHelpers = require('../utils/book-helpers')
const bookQueries = require('../utils/book-queries')

class BookDeleteRoute extends ApiDeleteRoute {
  constructor () {
    super(bookHelpers.params)
  }

  getSelectParams () {
    return bookHelpers.selectCols
  }

  /**
   * Override to use the custom Book SELECT method to run populate the Author.
   */
  async getSelectQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const recordId = request.params.id
    const params = {
      ownerId,
      recordId,
      selectCols: this.getSelectParams()
    }

    return bookQueries.selectBookAndPopulateAuthor(params)
  }
}

module.exports = new BookDeleteRoute().buildRoute()
