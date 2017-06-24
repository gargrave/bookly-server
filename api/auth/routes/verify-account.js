'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const apiErr = require('../../utils/apiErrors')
const globalHelpers = require('../../utils/routeHelpers')
const helpers = require('../utils/authRouteHelpers')

const params = {
  method: 'POST',
  path: 'auth/verify',
  auth: false,
  db: DB.USERS,
  resourceName: 'User'
}

class VerifyAccountRoute extends ApiRoute {
  constructor () {
    super(params)
  }

  getHandler () {
    return (request, reply) => {
      const token = request.payload.token
      this.query(token).then(res => reply(res))
    }
  }

  async query (token) {
    // see if the token matches one in the database
    // if so, use that email to update the matching account's verified to TRUE
    // if not, return an error message
    let result = await this.findExistingToken(token)
    result = await this.markAccountAsVerified(result)
    return result
  }

  async findExistingToken (token) {
    let val

    await knex(DB.TOKENS_VERIFY)
      .select()
      .where({ token })
      .limit(1)
      .then(res => {
        if (res.length) {
          val = res[0]
        }
      })

    return val
  }

  async markAccountAsVerified (token) {
    console.log('*****************************************')
    console.log('* TODO: verify-account.js')
    console.log('*   - Run an UPDATE query on the User\'s "verified" state')
    console.log('*   - Delete the entry from the tokens table, as it is no longer needed')
    console.log('*****************************************')
    return token
  }
}

module.exports = new VerifyAccountRoute().buildRoute()
