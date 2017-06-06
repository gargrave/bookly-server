const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.createTableIfNotExists(DB.BOOKS, (table) => {
    table.increments('id')

    // ownerId as foreign key to Users table
    table.integer('ownerId').notNullable()
    table.foreign('ownerId')
      .references(`${DB.USERS}.id`)
      .onDelete('CASCADE')

    // authorId as foreign key to Authors table
    table.integer('authorId').notNullable()
    table.foreign('authorId')
      .references(`${DB.AUTHORS}.id`)
      .onDelete('CASCADE')

    // book title
    table.string('title').notNullable()

    // unique requirments
    table.unique(['title', 'authorId'])

    // auto timestamps
    table.timestamps(true, true)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTableIfExists(DB.BOOKS)
}
