'use strict'

const APIDetailRoute = require('../../generic-routes/detail')

const DB = require('../../../globals/constants').db

const params = {
  path: 'authors',
  db: DB.AUTHORS,
  resourceName: 'Author'
}

module.exports = new APIDetailRoute(params)
