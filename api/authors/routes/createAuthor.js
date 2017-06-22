'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const helpers = require('../utils/authorRouteHelpers')
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
    return helpers.selectCols
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
