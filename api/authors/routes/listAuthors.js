'use strict'

let mock = require('../../../database/mocks/authorMock')
let knex = require('../../../database/db')

module.exports = {
  method: 'GET',
  path: '/api/v1/authors',
  config: {
    handler: (request, reply) => {
      reply(knex.select().from('author'))
    }
  }
}
