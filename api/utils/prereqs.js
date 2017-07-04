'use strict'

const globalHelpers = require('./route-helpers')

module.exports = {
  populateOwnerId (request, reply) {
    request.payload.owner_id = globalHelpers.getOwnerIdOrDieTrying(request, reply)
    return reply()
  }
}
