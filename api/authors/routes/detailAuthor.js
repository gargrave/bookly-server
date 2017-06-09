'use strict'

const APIDetailRoute = require('../../generic-routes/detail')

const DB = require('../../../globals/constants').db

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

function AuthorDetailRoute () {
  APIDetailRoute.call(this, params)
}
AuthorDetailRoute.prototype = Object.create(APIDetailRoute.prototype)

AuthorDetailRoute.prototype.getSelectCols = function () {
  return ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
}

module.exports = new AuthorDetailRoute()
