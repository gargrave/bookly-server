'use strict'

const ApiListRoute = require('../../generic-routes/list').ApiListRoute
const DB = require('../../../globals/constants').db

class BooksListRoute extends ApiListRoute {
  constructor () {
    super({
      path: 'books',
      db: DB.BOOKS
    })
  }

  getSelectParams () {
    return ['id', 'authorId', 'title', 'created_at', 'updated_at']
  }
}

module.exports = new BooksListRoute().buildRoute()
