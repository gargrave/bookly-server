'use strict'

const Boom = require('boom')

const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db

module.exports = {
  method: 'GET',
  path: '/api/v1/authors/{id}',
  config: {
    handler: (request, reply) => {
      const id = request.params.id

      knex(DB.AUTHORS).where('id', id).limit(1)
        .then(author => {
          if (!author.length) {
            return reply(Boom.notFound(`No author with id ${id} could be found.`))
          }
          reply(author)
        })
    }
  }
}
