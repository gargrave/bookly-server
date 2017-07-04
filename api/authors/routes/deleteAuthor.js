'use strict'

const ApiDeleteRoute = require('../../generic-routes/delete')

const authorHelpers = require('../utils/authorRouteHelpers')

class AuthorDeleteRoute extends ApiDeleteRoute {
  constructor () {
    super(authorHelpers.params)
  }

  getSelectParams () {
    return authorHelpers.selectCols
  }
}

module.exports = new AuthorDeleteRoute().buildRoute()
