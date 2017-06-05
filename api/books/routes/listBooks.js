'use strict'

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db

const pathName = 'books'
const dbName = DB.BOOKS

module.exports = {
  method: 'GET',
  path: `/api/v1/${pathName}`,

  config: {
    handler: (request, reply) => {
      knex.select().from(dbName)
        .then(result => {
          reply(result)
        })
    }
  }
}
