const knex = require('../../database/db')

const config = {
  directory: './database/seeds/'
}

knex.seed.run(config)
  .then(res => {
    console.log('DB seeding successful!')
    process.exit(0)
  })
  .catch(err => {
    console.log('DB seeding error!')
    console.log(err)
    process.exit(1)
  })
