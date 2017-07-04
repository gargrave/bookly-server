'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Bcrypt = require('bcrypt-nodejs')
const Boom = require('boom')

const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')

const apiErr = require('../../utils/api-errors')

const authHelpers = require('../utils/auth-helpers')
const authQueries = require('../utils/auth-queries')
const validator = require('../utils/auth-validator')

const params = {
  method: 'POST',
  path: 'auth/login',
  auth: false,
  db: DB.USERS,
  resourceName: 'User'
}

class LoginRoute extends ApiRoute {
  constructor () {
    super(params)
  }

  getValidators () {
    return { payload: validator.login }
  }

  getHandler () {
    return (request, reply) => {
      this.query(request, reply).then(res => reply(res))
    }
  }

  async query (request, reply) {
    let res = Boom.badRequest(apiErr.invalidLogin())

    try {
      const email = request.payload.email.trim()
      const password = request.payload.password.trim()

      let userRecord = await this.authenticateUser(email, password)
      // if the result has an 'id' property, it is a User
      // otherwise, it is a Boom error, and we should just return it as is
      if (userRecord.id) {
        userRecord = await authQueries.userUpdate(userRecord)
        // remove unnecessary fields from the reply
        delete userRecord.password
        delete userRecord.previous_login

        // now populate the Profile for the User
        let profileRecord = await authQueries.profileSelect(userRecord.id)
        if (profileRecord.id) {
          userRecord.profile = profileRecord
        }
      }
      res = userRecord
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('Error @ login.query():')
        console.error(err)
      }
      res = err
    }

    return res
  }

  /**
   * Attempts to authenticate the User in two steps:
   *    1. Run a SELECT query to find a User with the supplied email address
   *    2. Assuming a User is found, validate the supplied password against the stored hashed version
   *
   * We are returning a promise here in order to be able to function correctly with bcrypt's callback structure.
   */
  async authenticateUser (email, password) {
    let user = await authQueries.userSelect({ email, includePassword: true })
    return new Promise((resolve, reject) => {
      // assuming we get a user object, compare the passwords
      if (user.id) {
        Bcrypt.compare(password, user.password, function (err, match) {
          if (err) {
            // some unrelated error
            if (env.isDevEnv()) {
              console.log('Error @ login.authenticateUser():')
              console.error(err)
            }
            reject(Boom.notFound(apiErr.notFound(this.resourceName, email)))
          } else if (!match) {
            // non-matching username/password
            reject(Boom.badRequest(apiErr.invalidLogin()))
          } else {
            // credentials successfully verified! generate a JWT, and add it to reply
            user.token = authHelpers.buildJWT(user)
            resolve(user)
          }
        })
      } else {
        // if we did not get a user, we got an error. so return that instead
        reject(Boom.badRequest(apiErr.invalidLogin()))
      }
    })
  }
}

module.exports = new LoginRoute().buildRoute()
