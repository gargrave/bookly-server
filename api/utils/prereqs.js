'use strict'

const helpers = require('./routeHelpers')

module.exports = {
  populateOwnerId (request, reply) {
    request.payload.owner_id = helpers.getOwnerIdOrDieTrying(request, reply)
    return reply()
  }
}
