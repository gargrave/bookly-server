'use strict'

const Boom = require('boom')

module.exports = {
  populateOwnerId (request, reply) {
    const ownerId = request.auth.credentials.id
    if (!ownerId || !Number.isInteger(ownerId)) {
      return reply(Boom.unauthorized())
    }

    request.payload.ownerId = ownerId
    return reply()
  }
}
