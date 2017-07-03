const knex = require('../../database/db')
const log = require('../../globals/logger').verboseLog

const config = {
  directory: './database/migrations/',
  tableName: 'migrations'
}

knex.migrate.latest(config)
  .then(res => {
    log('DB migration successful!')
    process.exit(0)
  })
  .catch(err => {
    log('DB migration error!')
    console.log(err)
    process.exit(1)
  })
