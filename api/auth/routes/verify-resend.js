'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const env = require('../../../globals/env')

const mailer = require('../../emails/mailer')
const apiErrors = require('../../utils/apiErrors')

const params = {
  method: 'POST',
  path: 'auth/verify/resend',
  auth: false,
  db: DB.USERS,
  resourceName: 'User'
}

class VerifyResendRoute extends ApiRoute {
  constructor () {
    super(params)
  }

  getHandler () {
    return (request, reply) => {
      const to = request.payload.email // the "to" field for the email
      if (to) {
        this.confirmUserIsNotVerified(to).then(canProceed => {
          if (canProceed === true) {
            mailer.sendVerifyAccount({ to })
            reply({ message: 'Verification email sent.' })
          } else {
            reply(Boom.notFound(apiErrors.notFound('user', to)))
          }
        })
      } else {
        reply(Boom.notFound('No valid email address in request.'))
      }
    }
  }

  /**
   * Confirms that the requested user's account is unverified. Returns true
   * if User is NOT verified (i.e. if it is safe to send a verification email).
   *
   * Does this by running a SELECT query for the supplied email with "verified"
   * status of false. If any records are found, we know it is okay to proceed.
   *
   * The front end SHOULDN'T let a request get here is the User is already verified,
   * but this is just another check to prevent sending out an unnecessary verify link.
   *
   * @param {String} email The email address for the User to check.
   */
  async confirmUserIsNotVerified (email) {
    let canProceed = false

    try {
      let where = { email, verified: false }
      let foundUser = await knex(DB.USERS).where(where)
      if (foundUser.length) {
        canProceed = true
      }
    } catch (err) {
      if (env.isDevEnv()) {
        // there shouldn't be any errors here, so log it in dev mode
        console.log('Error @ confirmUserIsNotVerified():')
        console.dir(err)
      }
    }

    return canProceed
  }
}

module.exports = new VerifyResendRoute().buildRoute()
