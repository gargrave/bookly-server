'use strict'

const APICreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const prereqs = require('../../utils/prereqs')
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

function BookCreateRoute () {
  APICreateRoute.call(this, params)
}
BookCreateRoute.prototype = Object.create(APICreateRoute.prototype)

BookCreateRoute.prototype.getQueryCols = function () {
  return ['id', 'authorId', 'title', 'created_at', 'updated_at']
}

module.exports = new BookCreateRoute()
  .pre([
    { method: prereqs.populateOwnerId, failAction: 'error' }
  ])
  .validate({
    payload: validator.onCreate
  })
