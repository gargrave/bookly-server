const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists(DB.USERS, (table) => {
    table.increments('id')

    // user email
    table.string('email').notNullable()
    table.string('password').notNullable()

    // unique requirments
    table.unique('email')

    // auto timestamps
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists(DB.USERS)
}
