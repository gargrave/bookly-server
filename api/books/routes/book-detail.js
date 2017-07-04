'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')

const globalHelpers = require('../../utils/routeHelpers')

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

  async query (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request)
    const queryParams = {
      ownerId,
      recordId: request.params.id,
      selectCols: this.getSelectParams()
    }
    const result = await bookQueries.selectBookAndPopulateAuthor(queryParams)
    return result
  }
}

module.exports = new BookDetailRoute().buildRoute()
