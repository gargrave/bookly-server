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
   *    - Use the custom Profile payload builder
   *    - Update the 'updated_at' prop to use NOW()
   */
  buildPayload (payload) {
    return Promise.resolve(Object.assign({},
      authHelpers.buildPayloadForProfile(payload),
      { updated_at: knex.raw('NOW()') }
    ))
  }
}

module.exports = new ProfileUpdateRoute().buildRoute()
