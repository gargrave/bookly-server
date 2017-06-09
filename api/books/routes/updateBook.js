'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const DB = require('../../../globals/constants').db
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

class BookUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return ['id', 'authorId', 'title', 'created_at', 'updated_at']
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new BookUpdateRoute().buildRoute()
