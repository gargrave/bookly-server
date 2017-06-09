'use strict'

const APIListRoute = require('../../generic-routes/list')

const DB = require('../../../globals/constants').db

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

function AuthorsListRoute () {
  APIListRoute.call(this, params)
}
AuthorsListRoute.prototype = Object.create(APIListRoute.prototype)

AuthorsListRoute.prototype.getSelectCols = function () {
  return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
}

module.exports = new AuthorsListRoute()
