'use strict'

const ApiDeleteRoute = require('../../generic-routes/delete')

const helpers = require('../utils/authorRouteHelpers')

class AuthorDeleteRoute extends ApiDeleteRoute {
  constructor () {
    super(helpers.params)
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new AuthorDeleteRoute().buildRoute()
