'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Bcrypt = require('bcrypt-nodejs')
const Boom = require('boom')
const JWT = require('jsonwebtoken')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
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

  getHandler () {
    return (request, reply) => {
      const email = request.payload.email.trim()
      const password = request.payload.password.trim()

      this.query(email, password).then(res => reply(res))
    }
  }

  async query (email, password) {
    let result = await this.runSelectQuery(email, password)
    result = await this.runUpdateQuery(result)

    // remove unnecessary fields from the reply
    delete result.password
    delete result.previous_login

    return result
  }

  async runSelectQuery (email, password) {
    let val = Boom.badRequest(apiErr.invalidLogin())

    await knex(this.db)
      .select()
      .where({ email })
      .limit(1)
      .then(res => {
        if (res.length) {
          const user = res[0]
          const submittedPassword = password
          const hashedPassword = user.password

          Bcrypt.compare(submittedPassword, hashedPassword, function (err, match) {
            if (err) {
              // some unrelated error
              console.error(err)
              val = Boom.notFound(apiErr.notFound(this.resourceName, email))
            } else if (!match) {
              // non-matching username/password
              val = Boom.badRequest(apiErr.invalidLogin())
            } else {
              // credentials successfully verified! generate a JWT, and add it to reply
              user.token = helpers.buildJWT(user)
              val = user
            }
          })
        }
      }, err => {
        // no need for anything special for an error here, as the Boom error will be returned by default
        console.error(err)
      })

    return val
  }

  /**
   * Updates the current user record like so:
   *  The value of previous_login is copied to last_login
   *  The value of previous_login is set to now
   *
   * @param {*} user The data for the User who has successfully logged in.
   */
  async runUpdateQuery (user) {
    const { id, email } = user
    const updatedLastLogin = user.previous_login

    await knex(this.db)
      .where({ id, email })
      .update({
        last_login: updatedLastLogin,
        previous_login: knex.raw('NOW()')
      })
      .then(() => {
        // update the data we are sending back to client with the correct "last login" value
        user.last_login = updatedLastLogin
      })

    // no need to return a real value here; it doesn't matter
    return user
  }

  getValidators () {
    return { payload: validator.onLogin }
  }
}

module.exports = new LoginRoute().buildRoute()
