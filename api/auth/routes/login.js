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
              val = Boom.notFound(apiErr.notFound(this.esourceName, email))
            } else if (!match) {
              // non-matching username/password
              val = Boom.badRequest(apiErr.invalidLogin())
            } else {
              // credentials successfully verified!
              // generate a JWT, and add it to reply
              const jwtData = { id: user.id, email: user.email }
              const duration = process.env.JWT_DEFAULT_DURATION || (60 * 60)
              const jwtOptions = { expiresIn: duration }
              const token = JWT.sign(jwtData, process.env.AUTH_SECRET_KEY, jwtOptions)
              user.token = token

              // remove the password hash from the reply
              delete user.password

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

  getValidators () {
    return { payload: validator.onLogin }
  }
}

module.exports = new LoginRoute().buildRoute()
