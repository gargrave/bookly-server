'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const DB = require('../../../globals/constants').db
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
    return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new AuthorUpdateRoute().buildRoute()
