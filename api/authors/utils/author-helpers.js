'use strict'

const DB = require('../../../globals/constants').db

module.exports = {
  params: {
    path: 'authors',
    db: DB.AUTHORS,
    resourceName: 'Author'
  },

  selectCols: ['id', 'first_name', 'last_name', 'created_at', 'updated_at'],

  buildPayload (payload) {
    return {
      owner_id: payload.owner_id,
      first_name: payload.firstName,
      last_name: payload.lastName
    }
  }
}
