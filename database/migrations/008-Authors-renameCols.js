const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.table(DB.AUTHORS, (table) => {
    table.dropUnique(['ownerId', 'firstName', 'lastName'])
    table.renameColumn('ownerId', 'owner_id')
    table.renameColumn('firstName', 'first_name')
    table.renameColumn('lastName', 'last_name')
    table.unique(['owner_id', 'first_name', 'last_name'])
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table(DB.AUTHORS, (table) => {
    table.dropUnique(['owner_id', 'first_name', 'last_name'])
    table.renameColumn('owner_id', 'ownerId')
    table.renameColumn('first_name', 'firstName')
    table.renameColumn('last_name', 'lastName')
    table.unique(['ownerId', 'firstName', 'lastName'])
  })
}
