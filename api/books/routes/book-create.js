'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const globalPrereqs = require('../../utils/prereqs')

const bookHelpers = require('../utils/book-helpers')
const bookQueries = require('../utils/book-queries')
const validator = require('../utils/book-validator')

class BookCreateRoute extends ApiCreateRoute {
  constructor () {
    super(bookHelpers.params)
  }

  getSelectParams () {
    return bookHelpers.selectColsWithoutAuthor
  }

  getPrerequisites () {
    return [
      { method: globalPrereqs.populateOwnerId, failAction: 'error' }
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
      payload: await this.buildPayload(request.payload),
      returning: this.getSelectParams()
    }
    const result = await bookQueries.createBook(queryParams)
    return result
  }
}

module.exports = new BookCreateRoute().buildRoute()
