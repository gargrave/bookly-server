'use strict'

const APIListRoute = require('../../generic-routes/list')

const DB = require('../../../globals/constants').db

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

function BooksListRoute () {
  APIListRoute.call(this, params)
}
BooksListRoute.prototype = Object.create(APIListRoute.prototype)

BooksListRoute.prototype.getSelectCols = function () {
  return ['id', 'authorId', 'title', 'created_at', 'updated_at']
}

module.exports = new BooksListRoute()
