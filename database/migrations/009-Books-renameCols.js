const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.table(DB.BOOKS, (table) => {
    table.dropUnique(['title', 'authorId'])
    table.renameColumn('ownerId', 'owner_id')
    table.renameColumn('authorId', 'author_id')
    table.unique(['owner_id', 'title', 'author_id'])
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table(DB.BOOKS, (table) => {
    table.dropUnique(['owner_id', 'title', 'author_id'])
    table.renameColumn('owner_id', 'ownerId')
    table.renameColumn('author_id', 'authorId')
    table.unique(['title', 'authorId'])
  })
}
