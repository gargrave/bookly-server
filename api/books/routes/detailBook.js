'use strict'

const APIDetailRoute = require('../../generic-routes/detail')

const DB = require('../../../globals/constants').db

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

module.exports = new APIDetailRoute(params)
