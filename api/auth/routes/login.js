'use strict'

const Bcrypt = require('bcrypt')
const Boom = require('boom')
const JWT = require('jsonwebtoken')

const APIRoute = require('../../generic-routes/basic')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
const validator = require('../utils/authValidator')

const db = DB.USERS
const resourceName = 'User'

function LoginRoute () {
  APIRoute.call(this, 'POST', 'auth/login', false)

  this.config.handler = (request, reply) => {
    const email = request.payload.email.trim()

    knex(db)
      .where('email', email)
      .limit(1)
      .then(result => {
        if (!result.length) {
          return reply(Boom.notFound(apiErr.notFound(resourceName, email)))
        }

        const user = result[0]
        const hashedPassword = user.password
        const submittedPassword = request.payload.password

        Bcrypt.compare(submittedPassword, hashedPassword, function (err, match) {
          if (err) {
            // some unrelated error
            console.log(err)
            return reply(Boom.notFound(apiErr.notFound(resourceName, email)))
          } else if (!match) {
            // non-matching username/password
            return reply(Boom.badRequest(apiErr.invalidLogin()))
          }

          // generate a JWT, and add it to reply
          const jwtData = { id: user.id, email: user.email }
          const jwtOptions = { expiresIn: 60 * 5 }
          const token = JWT.sign(jwtData, 'ThisIsMySecret', jwtOptions)
          user.token = token

          // remove the password hash from the reply
          delete user.password
          return reply(user)
        })
      })
  }
}
LoginRoute.prototype = Object.create(APIRoute.prototype)

module.exports = new LoginRoute()
  .validate({ payload: validator.onLogin })
