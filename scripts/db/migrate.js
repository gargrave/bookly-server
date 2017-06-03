const knex = require('../../database/db')

const config = {
  directory: './database/migrations/',
  tableName: 'migrations'
}

knex.migrate.latest(config)
  .then(res => {
    console.log('DB migration successful!')
    process.exit(0)
  })
  .catch(err => {
    console.log('DB migration error!')
    console.log(err)
    process.exit(1)
  })
