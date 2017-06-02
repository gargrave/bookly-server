'use strict'

let Boom = require('boom')

let knex = require('../../../database/db')

module.exports = {
  method: 'GET',
  path: '/api/v1/authors/{id}',
  config: {
    handler: (request, reply) => {
      const id = request.params.id

      knex('author').where('id', id).limit(1)
        .then(author => {
          if (!author.length) {
            return reply(Boom.notFound(`No author with id ${id} could be found.`))
          }
          reply(author)
        })
    }
  }
}
