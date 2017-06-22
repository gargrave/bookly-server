'use strict'

const ApiListRoute = require('../../generic-routes/list')

const DB = require('../../../globals/constants').db
const helpers = require('../utils/authorRouteHelpers')

class AuthorsListRoute extends ApiListRoute {
  constructor () {
    super({
      path: 'authors',
      db: DB.AUTHORS
    })
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new AuthorsListRoute().buildRoute()
