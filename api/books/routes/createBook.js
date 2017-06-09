'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const prereqs = require('../../utils/prereqs')
const validator = require('../utils/bookValidator')

const params = {
  path: 'books',
  db: DB.BOOKS,
  resourceName: 'Book'
}

class BookCreateRoute extends ApiCreateRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return ['id', 'authorId', 'title', 'created_at', 'updated_at']
  }

  getPrerequisites () {
    return [
      { method: prereqs.populateOwnerId, failAction: 'error' }
    ]
  }

  getValidators () {
    return { payload: validator.onCreate }
  }
}

module.exports = new BookCreateRoute().buildRoute()
