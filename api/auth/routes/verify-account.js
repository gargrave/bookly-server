'use strict'

const ApiRoute = require('../../generic-routes/basic')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const knex = require('../../../database/db')
const env = require('../../../globals/env')

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
    if (result.token) {
      result = { verified: await this.markAccountAsVerified(result) }
    }
    return result
  }

  async findExistingToken (token) {
    let val = Boom.notFound()

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

  async markAccountAsVerified (tokenData) {
    let verified = false
    let where = { email: tokenData.email }
    const data = { verified: true }

    // update the Users DB to show this user as verified
    await knex(DB.USERS)
      .where(where)
      .update(data)
      .then(res => {
        if (res) {
          verified = true
        }
      })

    // then delete the token, as we no longer need it
    where.token = tokenData.token
    await knex(DB.TOKENS_VERIFY)
      .where(where)
      .del()
      .then(() => {
        // if the query is successful, we don't need to do anything here
      }, err => {
        if (env.isDevEnv()) {
          console.log('Error!')
          console.error(err)
        }
      })

    return verified
  }
}

module.exports = new VerifyAccountRoute().buildRoute()
