'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const knex = require('../../../database/db')

const authorHelpers = require('../utils/author-helpers')
const validator = require('../utils/author-validator')

class AuthorUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(authorHelpers.params)
  }

  getSelectParams () {
    return authorHelpers.selectCols
  }

  getValidators () {
    return { payload: validator.create }
  }

  /**
   * Override to do the following:
   *    - Use the custom Author payload builder
   *    - Update the 'updated_at' prop to use NOW()
   */
  buildPayload (payload) {
    return Promise.resolve(Object.assign({},
      authorHelpers.buildPayload(payload),
      { updated_at: knex.raw('NOW()') }
    ))
  }
}

module.exports = new AuthorUpdateRoute().buildRoute()
