'use strict'

let mock = require('../../../database/mocks/authorMock')

module.exports = {
  method: 'GET',
  path: '/api/v1/authors',
  config: {
    handler: (request, reply) => {
      reply(mock.get())
    }
  }
}
