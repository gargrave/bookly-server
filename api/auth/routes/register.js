'use strict'

const APICreateRoute = require('../../generic-routes/create')

const DB = require('../../../globals/constants').db
const validator = require('../utils/authValidator')

function RegisterRoute () {
  const params = {
    path: 'auth/register',
    db: DB.USERS,
    resourceName: 'Users'
  }
  APICreateRoute.call(this, params)
}

RegisterRoute.prototype = Object.create(APICreateRoute.prototype)

RegisterRoute.prototype.buildPayload = function (payload) {
  // TODO: hash the password with bcrypt before sending to DB
  // see here:
  // https://www.npmjs.com/package/bcrypt#usage

  // remove the 'passwordConfirm' prop
  delete payload.passwordConfirm
  return payload
}

module.exports = new RegisterRoute()
  .validate({ payload: validator.onCreate })
