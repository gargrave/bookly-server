'use strict'

const APIUpdateRoute = require('../../generic-routes/update')

const DB = require('../../../globals/constants').db
const validator = require('../utils/authorValidator')

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

function AuthorUpdateRoute () {
  APIUpdateRoute.call(this, params)
}
AuthorUpdateRoute.prototype = Object.create(APIUpdateRoute.prototype)

AuthorUpdateRoute.prototype.getQueryCols = function () {
  return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
}

module.exports = new AuthorUpdateRoute()
  .validate({
    payload: validator.onCreate
  })
