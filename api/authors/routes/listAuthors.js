'use strict'

const knex = require('../../../database/db')

module.exports = {
  method: 'GET',
  path: '/api/v1/authors',
  config: {
    handler: (request, reply) => {
      knex.select().from('Author')
        .then(authors => {
          reply(authors)
        })
    }
  }
}
