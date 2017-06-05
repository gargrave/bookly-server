'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')

const pathName = 'books'
const modelName = 'Book'
const dbName = DB.BOOKS

module.exports = {
  method: 'GET',
  path: `/api/v1/${pathName}/{id}`,

  config: {
    handler: (request, reply) => {
      const id = request.params.id

      knex(dbName)
        .where('id', id)
        .limit(1)
          .then(result => {
            if (!result.length) {
              return reply(Boom.notFound(apiErr.notFound(modelName, id)))
            }
            reply(result)
          })
    }
  }
}
