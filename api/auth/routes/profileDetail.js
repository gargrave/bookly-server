'use strict'

const ApiDetailRoute = require('../../generic-routes/detail')

const params = {
  method: 'GET',
  path: 'auth/profiles'
}

class ProfileDetailRoute extends ApiDetailRoute {
  constructor () {
    super(params)
  }

  getHandler () {
    return (request, reply) => {
      reply({ message: 'Profiles not yet implemented.' })
    }
  }

  getSelectParams () {
    return ['id', 'ownerId']
  }
}

module.exports = new ProfileDetailRoute().buildRoute()
