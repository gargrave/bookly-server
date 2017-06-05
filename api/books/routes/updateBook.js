'use strict'

const APIUpdateRoute = require('../../generic-routes/update')

const DB = require('../../../globals/constants').db
const prereqs = require('../utils/bookPrereqs')
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

module.exports = new APIUpdateRoute(params)
  .pre([
    { method: prereqs.ensureUnique, failAction: 'error' }
  ])
  .validate({
    payload: validator.create
  })
