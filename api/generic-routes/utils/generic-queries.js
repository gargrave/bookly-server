'use strict'

const Boom = require('boom')

const env = require('../../../globals/env')
const knex = require('../../../database/db')

const apiErr = require('../../utils/apiErrors')

module.exports = {
  async create ({ data, returning, dbName, resourceName = 'Record' }) {
    let res = Boom.badRequest(apiErr.failedToCreate(resourceName))

    try {
      const result = await knex(dbName)
        .insert(data)
        .returning(returning)

      if (result.length) {
        res = result[0]
      }
    } catch (err) {
      env.error(err, 'genericQueries.create()')

      const msg = err.message || ''
      // check if this is 'unique constaint' error
      if (msg.indexOf('violates unique constraint') !== -1) {
        res = Boom.badRequest(apiErr.matchingRecord(resourceName))
      }
    }

    return res
  }
}
