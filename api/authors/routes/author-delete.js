'use strict'

const ApiDeleteRoute = require('../../generic-routes/delete')

const authorHelpers = require('../utils/author-helpers')

class AuthorDeleteRoute extends ApiDeleteRoute {
  constructor () {
    super(authorHelpers.params)
  }

  getSelectParams () {
    return authorHelpers.selectCols
  }
}

module.exports = new AuthorDeleteRoute().buildRoute()
