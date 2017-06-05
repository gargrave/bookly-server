'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
const prereqs = require('../utils/bookPrereqs')
const validator = require('../utils/bookValidator')

const pathName = 'books'
const modelName = 'Book'
const dbName = DB.BOOKS

module.exports = {
  method: 'POST',
  path: `/api/v1/${pathName}`,

  config: {
    pre: [
      { method: prereqs.ensureUnique, failAction: 'error' }
    ],

    handler: (request, reply) => {
      const data = request.payload

      knex(dbName).insert(data).returning('*')
        .then(result => {
          reply(result)
        }, err => {
          console.log(err)
          reply(Boom.badRequest(apiErr.failedToCreate(modelName)))
        })
    },

    validate: {
      payload: validator.create
    }
  }
}
