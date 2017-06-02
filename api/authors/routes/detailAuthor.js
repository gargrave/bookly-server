'use strict'

let Boom = require('boom')

let mock = require('../../../database/mocks/authorMock')

module.exports = {
  method: 'GET',
  path: '/api/v1/authors/{id}',
  config: {
    handler: (request, reply) => {
      const id = Number(request.params.id)
      const author = mock.find(id)
      if (!author) {
        return reply(Boom.notFound(`No author with id ${id} could be found.`))
      }
      reply(author)
    }
  }
}
