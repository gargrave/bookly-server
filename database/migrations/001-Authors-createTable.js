const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists(DB.AUTHORS, (table) => {
    table.increments('id')

    // ownerId as foreign key to Users table
    table.integer('ownerId').notNullable()
    table.foreign('ownerId')
      .references(`${DB.USERS}.id`)
      .onDelete('CASCADE')

    // author first name and last name
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()

    // unique constraints
    table.unique(['ownerId', 'firstName', 'lastName'])

    // default timestamps
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists(DB.AUTHORS)
}
