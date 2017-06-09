'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const Bcrypt = require('bcrypt')

const DB = require('../../../globals/constants').db
const validator = require('../utils/authValidator')

const params = {
  path: 'auth/register',
  db: DB.USERS,
  resourceName: 'Users',
  auth: false
}

class RegisterRoute extends ApiCreateRoute {
  constructor () {
    super(params)
  }

  /**
   * Override to do the following:
   *    - Remove password from the selected cols;
   *      even though it is a hash at this point, it is still preferable not to return it.
   */
  getSelectParams () {
    return ['id', 'email', 'created_at', 'updated_at']
  }

  /**
   * Override to do the following:
   *    - Replace original password with hashed version before it goes to DB
   *    - Remove the 'passwordConfirm' property, as it is no longer needed at this point
   */
  buildPayload (payload) {
    const SALT_ROUNDS = 10
    return new Promise((resolve, reject) => {
      Bcrypt.hash(payload.password, SALT_ROUNDS, (err, hash) => {
        if (err) {
          console.error(`Error in generating hash: ${err}`)
          reject(payload)
        }

        payload.password = hash
        delete payload.passwordConfirm
        resolve(payload)
      })
    })
  }

  getValidators () {
    return { payload: validator.onRegister }
  }
}

module.exports = new RegisterRoute().buildRoute()
