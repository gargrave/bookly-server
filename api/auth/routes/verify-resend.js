'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const env = require('../../../globals/env')
const mailer = require('../../emails/mailer')

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
      const to = request.payload.email
      if (to) {
        mailer.sendVerifyAccount({ to })
        reply({ message: 'Email sent' })
      } else {
        reply(Boom.notFound('No valid email address in request.'))
      }
    }
  }
}

module.exports = new VerifyResendRoute().buildRoute()
