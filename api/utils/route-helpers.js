const Boom = require('boom')

module.exports = {
  getOwnerIdOrDieTrying (request, reply) {
    const id = request.auth.credentials.id
    if (!id || !Number.isInteger(id)) {
      reply(Boom.unauthorized())
    }
    return id
  }
}
