'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const authorHelpers = require('../utils/authorRouteHelpers')
const prereqs = require('../../utils/prereqs')
const validator = require('../utils/authorValidator')

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
    return { payload: validator.onCreate }
  }

  buildPayload (payload) {
    return Promise.resolve(authorHelpers.buildPayload(payload))
  }
}

module.exports = new AuthorCreateRoute().buildRoute()
