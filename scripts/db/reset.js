/*
A helper file to reset the databse by dropping ALL existing tables.
Note that this is set to only be allowed to run in a test environment--for obvious reasons.
*/
const knex = require('../../database/db')
const DB = require('../../globals/constants').db
const log = require('../../globals/logger').verboseLog

if (process.env.NODE_ENV === 'test') {
  let allTables = []
  for (let table in DB) {
    allTables.push(DB[table])
  }

  let dropQuery = `DROP TABLE IF EXISTS migrations, migrations_lock, ${allTables.join(', ')};`

  log('Dropping all tables to reset DB for tests...')

  knex.schema.raw(dropQuery)
    .then(() => {
      log('DB reset successful!')
      process.exit(0)
    }, err => {
      log('DB reset error!')
      console.log(err)
      process.exit(1)
    })
}
