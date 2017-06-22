'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const DB = require('../../../globals/constants').db
const helpers = require('../utils/authorRouteHelpers')
const validator = require('../utils/authorValidator')

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

class AuthorUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return helpers.selectCols
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new AuthorUpdateRoute().buildRoute()
