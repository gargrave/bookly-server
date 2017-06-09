'use strict'

const ApiCreateRoute = require('../../generic-routes/create').ApiCreateRoute

const DB = require('../../../globals/constants').db
const prereqs = require('../../utils/prereqs')
const validator = require('../utils/authorValidator')

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

class AuthorCreateRoute extends ApiCreateRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
  }

  getPrerequisites () {
    return [
      { method: prereqs.populateOwnerId, failAction: 'error' }
    ]
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new AuthorCreateRoute().buildRoute()
