'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const helpers = require('../utils/author-helpers')
const validator = require('../utils/author-validator')

class AuthorUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(helpers.params)
  }

  getSelectParams () {
    return helpers.selectCols
  }

  getValidators () {
    return { payload: validator.create }
  }
}

module.exports = new AuthorUpdateRoute().buildRoute()
