'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')

const DB = require('../../../globals/constants').db
const helpers = require('../utils/authorRouteHelpers')

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

class AuthorDetailRoute extends ApiDetailRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new AuthorDetailRoute().buildRoute()
