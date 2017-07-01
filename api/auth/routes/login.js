'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Bcrypt = require('bcrypt-nodejs')
const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')
const apiErr = require('../../utils/apiErrors')
const helpers = require('../utils/authRouteHelpers')
const authQueries = require('../utils/authQueries')
const validator = require('../utils/authValidator')

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
      let userRecord = await this.runSelectQuery(email, password)
      // if the result has an 'id' property, it is a User
      // otherwise, it is a Boom error, and we should just return it as is
      if (userRecord.id) {
        userRecord = await authQueries.userUpdate(userRecord)
        // remove unnecessary fields from the reply
        delete userRecord.password
        delete userRecord.previous_login
      }
      res = userRecord
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('Error @ login.runSelectQuery():')
        console.error(err)
      }
      res = err
    }

    return res
  }

  async runSelectQuery (email, password) {
    let user = await authQueries.userSelect({ email, includePassword: true })

    // assuming we get a user object,
    // compare its hashed password against the submitted password
    return new Promise((resolve, reject) => {
      if (user.id) {
        Bcrypt.compare(password, user.password, function (err, match) {
          if (err) {
            // some unrelated error
            if (env.isDevEnv()) {
              console.log('Error @ login.runSelectQuery():')
              console.error(err)
            }
            reject(Boom.notFound(apiErr.notFound(this.resourceName, email)))
          } else if (!match) {
            // non-matching username/password
            reject(Boom.badRequest(apiErr.invalidLogin()))
          } else {
            // credentials successfully verified! generate a JWT, and add it to reply
            user.token = helpers.buildJWT(user)
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
