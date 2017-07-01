'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const Bcrypt = require('bcrypt-nodejs')

const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')
const mailer = require('../../emails/mailer')
const authHelpers = require('../utils/authRouteHelpers')
const queries = require('../utils/authQueries')
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

  getSelectParams () {
    return authHelpers.selectCols
  }

  getValidators () {
    return { payload: validator.register }
  }

  getHandler () {
    return (request, reply) => {
      this.query(request, reply).then(res => reply(res))
    }
  }

  /**
   * Override to do the following:
   *    - User Bcrypt to hash the provided password
   *    - Replace original password with hashed version before it goes to DB
   *    - Remove the 'passwordConfirm' property, as it is no longer needed at this point
   */
  buildPayload (payload) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(payload.password, null, null, (err, hash) => {
        if (err) {
          if (env.isDevEnv()) {
            console.error(`Error in generating hash: ${err}`)
          }
          reject(payload)
        }

        payload.password = hash
        delete payload.passwordConfirm
        resolve(payload)
      })
    })
  }

  /**
   * Runs the full process for creating a new User account. Assuming there is
   * not already a User registered with the same email, this process goes like this:
   *
   *    1. Create a new User record with the provided data
   *    2. Use the ID from this record to create a new Profile record, and attach it to the reply
   *    3. Add an auth token to the reply (i.e. log the new user in immediately)
   *    4. Send a verification email to the new User
   */
  async query (request, reply) {
    let userData = await this.buildPayload(request.payload)
    let result = await queries.userCreate(userData)
    if (result.id) {
      let profile = await queries.profileCreate(result.id)
      result.profile = profile
      result.token = authHelpers.buildJWT(result)
      mailer.sendVerifyAccount({ to: result.email })
    }
    return result
  }
}

module.exports = new RegisterRoute().buildRoute()
