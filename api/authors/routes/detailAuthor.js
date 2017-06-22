'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')

const helpers = require('../utils/authorRouteHelpers')

class AuthorDetailRoute extends ApiDetailRoute {
  constructor () {
    super(helpers.params)
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new AuthorDetailRoute().buildRoute()
