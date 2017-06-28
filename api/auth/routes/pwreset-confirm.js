'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Bcrypt = require('bcrypt-nodejs')
const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const env = require('../../../globals/env')
const validator = require('../utils/authValidator')

const params = {
  method: 'POST',
  path: 'auth/passwordreset/confirm',
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
      this.query(request.payload).then(res => reply(res))
    }
  }

  getValidators () {
    return { payload: validator.passwordReset }
  }

  /**
   * Runs the full operation to update the User's password.
   * Steps are as follows:
   *    1. Confirm that the supplied token is still valid
   *    2. Generate a hashed version of the supplied password
   *    3. Send an UPDATE request to Users DB to update the User record
   *    4. Send a DELETE request to Tokens DB to delete the token after it has been used
   *
   * @param {*} payload The original request payload
   */
  async query (payload) {
    let res = { message: 'Password successfully updated!' }

    try {
      const tokenRecord = await this.confirmValidToken(payload)
      const email = tokenRecord[0].email
      const hashedPassword = await this.getPasswordHash(payload)
      await this.updateUserRecord(email, hashedPassword)
      await this.deleteTokenRecord(payload, email)
    } catch (err) {
      res = err
    }

    return res
  }

  /**
   * Checks the specified token against the DB to ensure that it is a valid token.
   * If it is not a valid token, and error will be thrown and we will not proceed.
   *
   * @param {*} payload The original request payload
   */
  async confirmValidToken (payload) {
    const token = payload.token
    let record

    // TODO need to also confirm that this has not expired, based on time
    try {
      record = await knex(DB.TOKENS_PASSWORD_RESET)
        .select('*')
        .where({ token })

      if (!record.length) {
        throw Boom.notFound('Invalid password reset token.')
      }
    } catch (err) {
      throw Boom.notFound('Invalid password reset token.')
    }

    return record
  }

  /**
   * Generates a hashed version of the update password
   *
   * @param {*} payload The original request payload
   */
  async getPasswordHash (payload) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(payload.password, null, null, (err, hash) => {
        if (err) {
          if (env.isDevEnv()) {
            console.error(`Error in generating hash: ${err}`)
          }
          reject(Boom.badRequest())
        }
        resolve(hash)
      })
    })
  }

  /**
   * Submits the UPDATE request to the DB to set the new password for the user.
   *
   * @param {*} email The User's registered email address
   * @param {*} password The HASHED version of the password (i.e. what will be written to DB)
   */
  async updateUserRecord (email, password) {
    let res

    try {
      res = await knex(DB.USERS)
        .where({ email })
        .update({ password })
        .returning('*')
    } catch (err) {
      res = Boom.badRequest(err)
    }

    return res
  }

  /**
   * Deletes the password reset token used for this operation from the DB.
   *
   * @param {*} payload The original request payload
   * @param {*} email The email address of the registered User
   */
  async deleteTokenRecord (payload, email) {
    const token = payload.token

    try {
      await knex(DB.TOKENS_PASSWORD_RESET)
        .where({ email, token })
        .del()
    } catch (err) {
      // if we encounter any errors here, it probably will not break anything
      if (env.isDevEnv()) {
        console.log('Error @ deleteTokenRecord():')
        console.dir(err)
      }
    }
  }
}

module.exports = new PasswordResetRequestRoute().buildRoute()
