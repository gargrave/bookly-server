'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')

const modelName = 'Author'
const dbName = DB.AUTHORS

module.exports = {
  ensureUnique (request, reply) {
    const { firstName, lastName } = request.payload

    knex(dbName)
      .where({ firstName, lastName })
        .then(result => {
          if (result.length) {
            return reply(Boom.badRequest(apiErr.matchingRecord(modelName)))
          }
          return reply()
        })
  }
}
