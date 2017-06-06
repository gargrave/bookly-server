'use strict'

const APIUpdateRoute = require('../../generic-routes/update')

const DB = require('../../../globals/constants').db
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

function BookUpdateRoute () {
  APIUpdateRoute.call(this, params)
}
BookUpdateRoute.prototype = Object.create(APIUpdateRoute.prototype)

BookUpdateRoute.prototype.getQueryCols = function () {
  return ['id', 'authorId', 'title', 'created_at', 'updated_at']
}

module.exports = new BookUpdateRoute()
  .validate({
    payload: validator.onCreate
  })
