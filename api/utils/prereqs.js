'use strict'

const helpers = require('./routeHelpers')

module.exports = {
  populateOwnerId (request, reply) {
    request.payload.ownerId = helpers.getOwnerIdOrDieTrying(request, reply)
    return reply()
  }
}
