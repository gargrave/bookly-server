'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Bcrypt = require('bcrypt')
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
    this.db = params.db
    this.resourceName = params.resourceName
  }

  getHandler () {
    return (request, reply) => {
      const email = request.payload.email.trim()

      knex(this.db)
        .where('email', email)
        .limit(1)
        .then(result => {
          if (!result.length) {
            return reply(Boom.notFound(apiErr.notFound(this.resourceName, email)))
          }

          const user = result[0]
          const hashedPassword = user.password
          const submittedPassword = request.payload.password

          Bcrypt.compare(submittedPassword, hashedPassword, function (err, match) {
            if (err) {
              // some unrelated error
              console.log(err)
              return reply(Boom.notFound(apiErr.notFound(this.esourceName, email)))
            } else if (!match) {
              // non-matching username/password
              return reply(Boom.badRequest(apiErr.invalidLogin()))
            }

            // generate a JWT, and add it to reply
            const jwtData = { id: user.id, email: user.email }
            const jwtOptions = { expiresIn: 60 * 60 }
            const token = JWT.sign(jwtData, process.env.AUTH_SECRET_KEY, jwtOptions)
            user.token = token

            // remove the password hash from the reply
            delete user.password
            return reply(user)
          })
        })
    }
  }

  getValidators () {
    return { payload: validator.onLogin }
  }
}

module.exports = new LoginRoute().buildRoute()
