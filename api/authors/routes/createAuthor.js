'use strict'

const APICreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const prereqs = require('../utils/authorPrereqs')
const validator = require('../utils/authorValidator')

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

module.exports = new APICreateRoute(params)
  .pre([
    { method: prereqs.ensureUnique, failAction: 'error' }
  ])
  .validate({
    payload: validator.create
  })
