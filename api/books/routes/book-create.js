'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const prereqs = require('../../utils/prereqs')
const bookHelpers = require('../utils/bookRouteHelpers')
const bookQueries = require('../utils/book-queries')
const validator = require('../utils/bookValidator')

class BookCreateRoute extends ApiCreateRoute {
  constructor () {
    super(bookHelpers.params)
  }

  getSelectParams () {
    return bookHelpers.selectColsWithoutAuthor
  }

  getPrerequisites () {
    return [
      { method: prereqs.populateOwnerId, failAction: 'error' }
    ]
  }

  getValidators () {
    return { payload: validator.create }
  }

  buildPayload (payload) {
    return Promise.resolve(bookHelpers.buildPayload(payload))
  }

  getHandler () {
    return (request, reply) => {
      this.query(request, reply).then(res => reply(res))
    }
  }

  async query (request, reply) {
    const queryParams = {
      data: await this.buildPayload(request.payload),
      returning: this.getSelectParams()
    }
    const result = await bookQueries.createBook(queryParams)
    return result
  }
}

module.exports = new BookCreateRoute().buildRoute()
