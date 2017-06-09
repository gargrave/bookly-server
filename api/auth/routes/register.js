'use strict'

const Bcrypt = require('bcrypt')

const APICreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const validator = require('../utils/authValidator')

const SALT_ROUNDS = 10

function RegisterRoute () {
  const params = {
    path: 'auth/register',
    db: DB.USERS,
    resourceName: 'Users',
    auth: false
  }
  APICreateRoute.call(this, params)
}
RegisterRoute.prototype = Object.create(APICreateRoute.prototype)

/*
Override to do the following:
  - Remove password from the selected cols; even though it is a hash at this point,
      it is still preferable not to return it.
*/
RegisterRoute.prototype.getSelectCols = function () {
  return ['id', 'email', 'created_at', 'updated_at']
}

/*
Override to do the following:
  - Replace original password with hashed version before it goes to DB
  - Remove the 'passwordConfirm' property, as it is no longer needed at this point
*/
RegisterRoute.prototype.buildPayload = function (payload) {
  return new Promise((resolve, reject) => {
    Bcrypt.hash(payload.password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        console.log(`Error in generating hash: ${err}`)
        reject(payload)
      }

      payload.password = hash
      delete payload.passwordConfirm
      resolve(payload)
    })
  })
}

module.exports = new RegisterRoute()
  .validate({ payload: validator.onRegister })
