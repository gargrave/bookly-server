'use strict'

const ApiUpdateRoute = require('../../generic-routes/update')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')

const authHelpers = require('../utils/auth-helpers')
const validator = require('../utils/auth-validator')

const params = {
  path: 'auth/profiles',
  db: DB.PROFILES,
  resourceName: 'Profile'
}

class ProfileUpdateRoute extends ApiUpdateRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return authHelpers.profileSelectCols
  }

  getValidators () {
    return { payload: validator.update }
  }

  /**
   * Override to do the following:
   *    - Update naming to snake_case
   *    - Provide defaults for non-required values
   */
  buildPayload (payload) {
    return new Promise((resolve, reject) => {
      resolve(Object.assign({},
        {
          first_name: payload.firstName || '',
          last_name: payload.lastName || ''
        },
        {
          updated_at: knex.raw('NOW()')
        }
      ))
    })
  }

  /**
   * HACK:
   * This is only a temp fix until we revamp the DB migrations to user "owner_id" instead of "ownerId".
   * Can be removed at a later date.
   *
   * Runs all necessary queries and returns either error or data.
   *
   * @param {Object} data The payload data for the create request
   */
  async query (id, ownerId, data) {
    let result = await this.runUpdateQuery({ id, owner_id: ownerId }, data)
    return result
  }
}

module.exports = new ProfileUpdateRoute().buildRoute()
