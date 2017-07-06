'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const env = require('../../../globals/env')

const apiErr = require('../../utils/api-errors')

module.exports = {
  /**
   * Performs a COUNT operation for the supplied owner ID on the specified table.
   *
   * 'params' must be an object that includes the following:
   *    - ownerId - The owner ID for the user to query
   *    - table - The name of the table to query
   */
  async countRows (params) {
    let res = Boom.badRequest()

    const { ownerId, table } = params
    const where = { owner_id: ownerId }

    try {
      const countResult = await knex(table)
        .count('*')
        .where(where)

      if (countResult.length) {
        return Number(countResult[0].count)
      }
    } catch (err) {
      env.error(err, 'genericQueries.countRows()')
    }

    return res
  },

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
      env.error(err, 'genericQueries.selectOne()')
    }

    return res
  },

  /**
   * Performs a SELECT operation for the supplied owner ID on the specified table.
   * Pagination can be specified with the 'limit' and 'offset' properties.
   *
   * 'params' must be an object that includes the following:
   *    - ownerId {Number} - The owner ID for the user to query
   *    - table {String} - The name of the table to query
   *    - select {String[]} - A list of column names to SELECT
   *    - limit {Number} - The number of results to LIMIT to (defaults to 25)
   *    - offset {Number} - The offset to use in conjunction with LIMIT
   */
  async selectMany (params) {
    let res = Boom.badRequest()

    const { ownerId, table, select, limit, offset } = params
    const where = { owner_id: ownerId }

    try {
      const records = await knex(table)
        .select(select)
        .where(where)
        .limit(limit || 25)
        .offset(offset || 0)

      res = records
    } catch (err) {
      env.error(err, 'genericQueries.selectAll()')
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

  async update ({ ownerId, recordId, data, returning, dbName, resourceName = 'Record' }) {
    let res = Boom.badRequest(apiErr.failedToUpdate(resourceName))

    const where = { owner_id: ownerId, id: recordId }

    try {
      const result = await knex(dbName)
        .where(where)
        .update(data)
        .returning(returning)

      if (result.length) {
        res = result[0]
      }
    } catch (err) {
      env.error(err, 'genericQueries.update()')
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
      env.error(err, 'genericQueries.delete()')
    }

    return res
  }
}
