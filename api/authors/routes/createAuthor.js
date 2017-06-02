'use strict'

const mock = require('../../../database/mocks/authorMock')
const prereqs = require('../utils/authorPrereqs')
const validator = require('../utils/authorValidator')

module.exports = {
  method: 'POST',
  path: '/api/v1/authors',
  config: {
    pre: [
      prereqs.ensureUnique
    ],
    handler: (request, reply) => {
      const data = request.payload
      const author = mock.create(data)
      reply(author)
    },
    validate: {
      payload: validator.create
    }
  }
}
