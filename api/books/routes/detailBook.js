'use strict'

const APIDetailRoute = require('../../generic-routes/detail')

const DB = require('../../../globals/constants').db

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

function BookDetailRoute () {
  APIDetailRoute.call(this, params)
}
BookDetailRoute.prototype = Object.create(APIDetailRoute.prototype)

BookDetailRoute.prototype.getSelectCols = function () {
  return ['id', 'authorId', 'title', 'created_at', 'updated_at']
}

module.exports = new BookDetailRoute()
