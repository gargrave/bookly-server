'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const Bcrypt = require('bcrypt')
const Boom = require('boom')
const JWT = require('jsonwebtoken')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
const validator = require('../utils/authValidator')

const params = {
  path: 'auth/register',
  db: DB.USERS,
  resourceName: 'Users',
  auth: false
}

class RegisterRoute extends ApiCreateRoute {
  constructor () {
    super(params)
  }

  getHandler () {
    return (request, reply) => {
      this.buildPayload(request.payload)
        .then(data => {
          knex(this.db)
            .insert(data)
            .returning(this.getSelectParams())
              .then(result => {
                const user = result[0]
                // TODO: move this to an 'after hook'
                // generate a JWT, and add it to reply
                const jwtData = { id: user.id, email: user.email }
                const jwtOptions = { expiresIn: 60 * 60 * 8 }
                const token = JWT.sign(jwtData, process.env.AUTH_SECRET_KEY, jwtOptions)
                user.token = token
                reply(user)
              }, err => {
                console.error(err)
                reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
              })
        }, err => {
          console.error(err)
          reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
        })
    }
  }

  /**
   * Override to do the following:
   *    - Remove password from the selected cols;
   *      even though it is a hash at this point, it is still preferable not to return it.
   */
  getSelectParams () {
    return ['id', 'email', 'created_at', 'updated_at']
  }

  /**
   * Override to do the following:
   *    - Replace original password with hashed version before it goes to DB
   *    - Remove the 'passwordConfirm' property, as it is no longer needed at this point
   */
  buildPayload (payload) {
    const SALT_ROUNDS = 10
    return new Promise((resolve, reject) => {
      Bcrypt.hash(payload.password, SALT_ROUNDS, (err, hash) => {
        if (err) {
          console.error(`Error in generating hash: ${err}`)
          reject(payload)
        }

        payload.password = hash
        delete payload.passwordConfirm
        resolve(payload)
      })
    })
  }

  getValidators () {
    return { payload: validator.onRegister }
  }
}

module.exports = new RegisterRoute().buildRoute()
