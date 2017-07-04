'use strict'

const Boom = require('boom')

const env = require('../../../globals/env')
const knex = require('../../../database/db')

const apiErr = require('../../utils/apiErrors')

module.exports = {
  async selectOne ({ ownerId, recordId, selectCols, dbName, resourceName = 'Record' }) {
    let res = Boom.badRequest(apiErr.notFound(resourceName, recordId))

    const where = { owner_id: ownerId, id: recordId }

    try {
      const result = await knex(dbName)
        .select(selectCols)
        .where(where)
        .limit(1)

      if (result.length) {
        res = result[0]
      }
    } catch (err) {
      env.error(err, 'genericQueries.select()')
    }

    return res
  },

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
  },

  async delete ({ ownerId, recordId, dbName, resourceName }) {
    let res = Boom.badRequest(apiErr.failedToDelete(resourceName))

    const where = { owner_id: ownerId, id: recordId }

    try {
      const result = await knex(dbName)
        .where(where)
        .del()

      // DELETE query will return number of rows deleted
      if (result === 1) {
        res = null
      }
    } catch (err) {
      env.error(err, 'genericQueries.create()')
    }

    return res
  }
}
