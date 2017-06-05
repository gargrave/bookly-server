'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')

const modelName = 'Book'
const dbName = DB.BOOKS

module.exports = {
  ensureUnique (request, reply) {
    const { authorId, title } = request.payload

    knex(dbName)
      .where({ authorId, title })
        .then(result => {
          if (result.length) {
            return reply(Boom.badRequest(apiErr.matchingRecord(modelName)))
          }
          return reply()
        })
  }
}
