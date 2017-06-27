const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists(DB.TOKENS_PASSWORD_RESET, (table) => {
    table.increments('id')

    // author first name and last name
    table.string('email').notNullable()
    table.string('token').notNullable()

    table.timestamp('created_at').defaultTo(knex.fn.now())

    // unique constraints
    table.unique('email')
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists(DB.TOKENS_PASSWORD_RESET)
}
