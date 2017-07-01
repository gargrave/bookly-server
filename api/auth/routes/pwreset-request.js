'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const env = require('../../../globals/env')

const mailer = require('../../emails/mailer')
const apiErrors = require('../../utils/apiErrors')
const utils = require('../../utils/utils')

const validator = require('../utils/auth-validator')

const params = {
  method: 'POST',
  path: 'auth/passwordreset',
  auth: false,
  db: DB.USERS,
  resourceName: 'User'
}

class PasswordResetRequestRoute extends ApiRoute {
  constructor () {
    super(params)
  }

  getHandler () {
    return (request, reply) => {
      this.query(request).then(res => reply(res))
    }
  }

  getValidators () {
    return { payload: validator.passwordResetRequest }
  }

  async query (request, reply) {
    const to = request.payload.email // the "to" field for the email
    let res = Boom.notFound(apiErrors.notFound('user', to))

    if (to) {
      const canProceed = await this.confirmEmailIsValid(to)
      if (canProceed === true) {
        const token = utils.getRandomToken(36)
        await this.removeExistingToken(to)

        let insertResult = await this.saveTokenToDB(to, token)
        if (insertResult.length) {
          mailer.sendPasswordReset({ to, token })
          res = { message: `Password reset email sent to: ${to}.` }
        } else {
          res = insertResult
        }
      }
    } else {
      res = Boom.notFound('No valid email address in request.')
    }

    return res
  }

  /**
   * Confirms that the provided email is attached to an account.
   *
   * @param {String} email The email address for the User to check.
   */
  async confirmEmailIsValid (email) {
    let canProceed = false

    try {
      let where = { email }
      let foundUser = await knex(DB.USERS).where(where)
      if (foundUser.length) {
        canProceed = true
      }
    } catch (err) {
      if (env.isDevEnv()) {
        // there shouldn't be any errors here, so log it in dev mode
        console.log('Error @ confirmEmailIsValid():')
        console.dir(err)
      }
    }

    return canProceed
  }

  /**
   * Removes any existing password reset tokens associated with this email from the database.
   * This will help prevent collisions if a user makes multiple requests.
   *
   * @param {*} email The email for the user in question
   */
  async removeExistingToken (email) {
    try {
      await knex(DB.TOKENS_PASSWORD_RESET)
        .del()
        .where({ email })
    } catch (err) {
      // if we encounter any errors here, it probably will not break anything
      if (env.isDevEnv()) {
        console.log('Error @ removeExistingToken():')
        console.dir(err)
      }
    }
  }

  async saveTokenToDB (email, token) {
    let res = Boom.badRequest('There was an error processing the password reset request.')
    try {
      res = await knex(DB.TOKENS_PASSWORD_RESET)
        .insert({ email, token })
        .returning('*')
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('Error @ saveTokenToDB():')
        console.dir(err)
      }
    }
    return res
  }
}

module.exports = new PasswordResetRequestRoute().buildRoute()
