'use strict'

const APIListRoute = require('../../generic-routes/list')

const DB = require('../../../globals/constants').db

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

module.exports = new APIListRoute(params)
