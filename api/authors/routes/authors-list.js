'use strict'

const ApiListRoute = require('../../generic-routes/list')

const helpers = require('../utils/author-helpers')

class AuthorsListRoute extends ApiListRoute {
  constructor () {
    super(helpers.params)
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new AuthorsListRoute().buildRoute()
