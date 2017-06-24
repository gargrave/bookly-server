'use strict'

const ApiCreateRoute = require('../../generic-routes/create')

const Bcrypt = require('bcrypt-nodejs')
const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')
const apiErr = require('../../utils/apiErrors')
const helpers = require('../utils/authRouteHelpers')
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
      this.buildPayload(request.payload).then(data => {
        this.query(data).then(res => reply(res))
      }, err => {
        if (env.isDevEnv()) {
          console.error(err)
        }
        reply(Boom.badRequest(apiErr.failedToCreate(this.resourceName)))
      })
    }
  }

  /**
   * Override to do the following:
   *    - Replace original password with hashed version before it goes to DB
   *    - Remove the 'passwordConfirm' property, as it is no longer needed at this point
   */
  buildPayload (payload) {
    return new Promise((resolve, reject) => {
      Bcrypt.hash(payload.password, null, null, (err, hash) => {
        if (err) {
          if (env.isDevEnv()) {
            console.error(`Error in generating hash: ${err}`)
          }
          reject(payload)
        }

        payload.password = hash
        delete payload.passwordConfirm
        resolve(payload)
      })
    })
  }

  async query (data) {
    let result = await this.runInsertQuery(data)
    return result
  }

  async runInsertQuery (data) {
    let val = Boom.badRequest(apiErr.userExists())

    await knex(this.db)
      .insert(data)
      .returning(this.getSelectParams())
      .then(res => {
        // generate a JWT, and add it to reply
        const user = res[0]
        user.token = helpers.buildJWT(user)
        val = user
      }, err => {
        if (env.isDevEnv()) {
          console.error(err)
        }
      })

    return val
  }

  getSelectParams () {
    return helpers.selectCols
  }

  getValidators () {
    return { payload: validator.onRegister }
  }
}

module.exports = new RegisterRoute().buildRoute()
