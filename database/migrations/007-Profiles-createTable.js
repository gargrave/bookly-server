const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists(DB.PROFILES, (table) => {
    table.increments('id')

    // ownerId as foreign key to Users table
    table.integer('owner_id').notNullable()
    table.foreign('owner_id')
      .references(`${DB.USERS}.id`)
      .onDelete('CASCADE')

    // user email
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()

    // auto timestamps
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists(DB.PROFILES)
}
