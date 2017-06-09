'use strict'

const ApiListRoute = require('../../generic-routes/list').ApiListRoute
const DB = require('../../../globals/constants').db

class AuthorsListRoute extends ApiListRoute {
  constructor () {
    super({
      path: 'authors',
      db: DB.AUTHORS
    })
  }

  getSelectParams () {
    return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
  }
}

module.exports = new AuthorsListRoute().buildRoute()
