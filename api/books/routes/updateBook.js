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
  method: ['PUT', 'PATCH'],
  path: `/api/v1/${pathName}/{id}`,

  config: {
    pre: [
      { method: prereqs.ensureUnique, failAction: 'error' }
    ],

    handler: (request, reply) => {
      const data = Object.assign({},
        request.payload,
        { updated_at: knex.raw('NOW()') }
      )

      knex(dbName)
        .where('id', request.params.id)
        .update(data)
        .returning('*')
          .then(result => {
            reply(result)
          }, err => {
            console.log(err)
            reply(Boom.badRequest(apiErr.failedToUpdate(modelName)))
          })
    },

    validate: {
      payload: validator.create
    }
  }
}
