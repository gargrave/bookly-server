'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')
const DB = require('../../../globals/constants').db

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

class BookDetailRoute extends ApiDetailRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return ['id', 'authorId', 'title', 'created_at', 'updated_at']
  }
}

module.exports = new BookDetailRoute().buildRoute()
