'use strict'

const APICreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const prereqs = require('../../utils/prereqs')
const validator = require('../utils/authorValidator')

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

function AuthorCreateRoute () {
  APICreateRoute.call(this, params)
}
AuthorCreateRoute.prototype = Object.create(APICreateRoute.prototype)

AuthorCreateRoute.prototype.getSelectCols = function () {
  return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
}

module.exports = new AuthorCreateRoute()
  .pre([
    { method: prereqs.populateOwnerId, failAction: 'error' }
  ])
  .validate({
    payload: validator.onCreate
  })
