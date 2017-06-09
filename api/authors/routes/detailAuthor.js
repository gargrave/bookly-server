'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')
const DB = require('../../../globals/constants').db

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
    return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
  }
}

module.exports = new AuthorDetailRoute().buildRoute()
