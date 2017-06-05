const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists(DB.AUTHORS, (table) => {
    table.increments('id')
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()
    table.unique(['firstName', 'lastName'])
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists('Author')
}
