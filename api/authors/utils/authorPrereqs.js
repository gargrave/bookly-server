'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')

module.exports = {
  ensureUnique (request, reply) {
    const { firstName, lastName } = request.payload

    knex('Author').where({ firstName, lastName })
      .then(author => {
        if (author.length) {
          return reply(Boom.badRequest('A matching Author already exists.'))
        }
        return reply()
      })
  }
}
