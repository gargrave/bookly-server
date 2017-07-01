'use strict'

const ApiRoute = require('../../generic-routes/basic')

const DB = require('../../../globals/constants').db

const globalHelpers = require('../../utils/routeHelpers')

const authHelpers = require('../utils/auth-helpers')
const authQueries = require('../utils/auth-queries')

const params = {
  method: 'GET',
  path: 'auth/users',
  db: DB.USERS,
  resourceName: 'User'
}

class UserDetailRoute extends ApiRoute {
  constructor () {
    super(params)
  }

  getSelectParams () {
    return authHelpers.selectCols
  }

  getHandler () {
    return (request, reply) => {
      this.query(request, reply).then(res => reply(res))
    }
  }

  /**
   * Attempts to SELECT the User record with associated owner id.
   * Also attempts to SELECT the associated Profile and add it to the reply.
   * @param {*} ownerId The owner ID of the User to find.
   */
  async query (request, reply) {
    const ownerId = globalHelpers.getOwnerIdOrDieTrying(request, reply)

    let userRecord = await authQueries.userSelect({ id: ownerId })
    let profileRecord = await authQueries.profileSelect(ownerId)
    if (profileRecord.id) {
      userRecord.profile = profileRecord
    }
    return userRecord
  }
}

module.exports = new UserDetailRoute().buildRoute()
