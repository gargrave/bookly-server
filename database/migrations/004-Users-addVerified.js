/*
 * Migration to add one column to the "Users" table:
 *  - verified - Whether the user has verified their account
 */
const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.table(DB.USERS, (table) => {
    table.boolean('verified').defaultTo(false)
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table(DB.USERS, (table) => {
    table.dropColumn('verified')
  })
}
