'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const prereqs = require('../utils/authorPrereqs')
const validator = require('../utils/authorValidator')

module.exports = {
  method: ['PUT', 'PATCH'],
  path: '/api/v1/authors/{id}',
  config: {
    pre: [
      { method: prereqs.ensureUnique, failAction: 'error' }
    ],

    handler: (request, reply) => {
      const data = Object.assign({},
        request.payload,
        { updated_at: knex.raw('NOW()') }
      )

      knex(DB.AUTHORS)
        .where('id', request.params.id)
        .update(data).returning('*')
          .then(author => {
            reply(author)
          }, err => {
            console.log(err)
            reply(Boom.badRequest('Author update failed.'))
          })
    },

    validate: {
      payload: validator.create
    }
  }
}
