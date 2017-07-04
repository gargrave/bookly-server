'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const prereqs = require('../../utils/prereqs')

const authorHelpers = require('../utils/author-helpers')
const validator = require('../utils/author-validator')

class AuthorCreateRoute extends ApiCreateRoute {
  constructor () {
    super(authorHelpers.params)
  }

  getSelectParams () {
    return authorHelpers.selectCols
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
    return Promise.resolve(authorHelpers.buildPayload(payload))
  }
}

module.exports = new AuthorCreateRoute().buildRoute()
