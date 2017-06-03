const knex = require('../../database/db')

const config = {
  directory: './database/migrations/',
  tableName: 'migrations'
}

knex.migrate.rollback(config)
  .then(res => {
    console.log('DB rollback successful!')
    process.exit(0)
  })
  .catch(err => {
    console.log('DB rollback error!')
    console.log(err)
    process.exit(1)
  })
