'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const prereqs = require('../utils/authorPrereqs')
const validator = require('../utils/authorValidator')

module.exports = {
  method: 'POST',
  path: '/api/v1/authors',
  config: {
    pre: [
      {
        method: prereqs.ensureUnique,
        failAction: 'error'
      }
    ],

    handler: (request, reply) => {
      const data = request.payload

      knex(DB.AUTHORS).insert(data).returning('*')
        .then(author => {
          reply(author)
        }, err => {
          console.log(err)
          reply(Boom.badRequest('Author creation failed.'))
        })
    },

    validate: {
      payload: validator.create
    }
  }
}
