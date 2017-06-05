'use strict'

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db

module.exports = {
  method: 'GET',
  path: '/api/v1/authors',
  config: {
    handler: (request, reply) => {
      knex.select().from(DB.AUTHORS)
        .then(authors => {
          reply(authors)
        })
    }
  }
}
