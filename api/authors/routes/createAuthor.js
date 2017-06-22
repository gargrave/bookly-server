'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const helpers = require('../utils/authorRouteHelpers')
const prereqs = require('../../utils/prereqs')
const validator = require('../utils/authorValidator')

class AuthorCreateRoute extends ApiCreateRoute {
  constructor () {
    super(helpers.params)
  }

  getSelectParams () {
    return helpers.selectCols
  }

  getPrerequisites () {
    return [
      { method: prereqs.populateOwnerId, failAction: 'error' }
    ]
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new AuthorCreateRoute().buildRoute()
