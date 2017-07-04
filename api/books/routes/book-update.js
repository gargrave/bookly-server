'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const globalHelpers = require('../../utils/routeHelpers')

const bookHelpers = require('../utils/book-helpers')
const bookQueries = require('../utils/book-queries')
const validator = require('../utils/book-validator')

class BookUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(bookHelpers.params)
  }

  getSelectParams () {
    return bookHelpers.selectColsWithoutAuthor
  }

  getValidators () {
    return { payload: validator.create }
  }

  buildPayload (payload) {
    return Promise.resolve(bookHelpers.buildPayload(payload))
  }

  /**
   * Override to use custom Book UPDATE query.
   */
  async getUpdateQuery (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    const recordId = request.params.id
    const payload = await this.buildPayload(request.payload)

    const params = {
      ownerId,
      recordId,
      payload,
      returning: this.getSelectParams(),
      dbName: this.db,
      resourceName: this.resourceName
    }
    return bookQueries.updateBook(params)
  }
}

module.exports = new BookUpdateRoute().buildRoute()
