'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')

const globalHelpers = require('../../utils/route-helpers')

const bookHelpers = require('../utils/book-helpers')
const bookQueries = require('../utils/book-queries')

class BookDetailRoute extends ApiDetailRoute {
  constructor () {
    super(bookHelpers.params)
  }

  getSelectParams () {
    return bookHelpers.selectCols
  }

  getHandler () {
    return (request, reply) => {
      this.query(request, reply).then(res => reply(res))
    }
  }

  /**
   * Override to use custom Book SELECT query to populate Author.
   * @param {*} request
   * @param {*} reply
   */
  async getSelectQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request)
    const queryParams = {
      ownerId,
      recordId: request.params.id,
      selectCols: this.getSelectParams()
    }
    return bookQueries.selectOneBookAndPopulateAuthor(queryParams)
  }
}

module.exports = new BookDetailRoute().buildRoute()
