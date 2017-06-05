'use strict'

const APICreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const prereqs = require('../utils/bookPrereqs')
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

module.exports = new APICreateRoute(params)
  .pre([
    { method: prereqs.ensureUnique, failAction: 'error' }
  ])
  .validate({
    payload: validator.create
  })
