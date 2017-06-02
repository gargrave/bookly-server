const Boom = require('boom')

const mock = require('../../../database/mocks/authorMock')

module.exports = {
  ensureUnique (request, reply) {
    const { firstName, lastName } = request.payload
    const data = mock.get()

    data.forEach(a => {
      if (a.firstName === firstName && a.lastName === lastName) {
        return reply(Boom.badRequest('A matching Author already exists.'))
      }
    })
    return reply()
  }
}
