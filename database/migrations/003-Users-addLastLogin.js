/*
 * Migration to add two columns to the "Users" table:
 *  - last_login - The date/time of the User's last successful login
 *  - previous_login - The date/time of the User's previous successful login
 *
 * Whenever the User logs in, the value from previous_login will be used to update
 *    last_login, and previous_login will be updated to the current time.
 */

const DB = require('../../globals/constants').db

exports.up = function (knex, Promise) {
  return knex.schema.table(DB.USERS, (table) => {
    table.dateTime('last_login').defaultTo(knex.fn.now())
    table.dateTime('previous_login').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.table(DB.USERS, (table) => {
    table.dropColumn('last_login')
    table.dropColumn('previous_login')
  })
}
