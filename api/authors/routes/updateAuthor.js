'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const helpers = require('../utils/authorRouteHelpers')
const validator = require('../utils/authorValidator')

class AuthorUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(helpers.params)
  }

  getSelectParams () {
    return helpers.selectCols
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new AuthorUpdateRoute().buildRoute()
