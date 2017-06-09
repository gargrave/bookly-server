'use strict'

const APIRoute = require('../../generic-routes/basic').APIRoute

function ProfileDetailRoute () {
  APIRoute.call(this, 'GET', 'auth/profiles')

  this.config.handler = (request, reply) => {
    reply({ message: 'Profiles not yet implemented.' })
  }
}
ProfileDetailRoute.prototype = Object.create(APIRoute.prototype)

ProfileDetailRoute.prototype.getSelectCols = function () {
  return ['id', 'ownerId']
}

module.exports = new ProfileDetailRoute()
