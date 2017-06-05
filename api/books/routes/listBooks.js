'use strict'

const APIListRoute = require('../../generic-routes/list')

const DB = require('../../../globals/constants').db

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

module.exports = new APIListRoute(params)
