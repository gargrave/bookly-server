const knex = require('../../database/db')

const config = {
  directory: './database/seeds/'
}

// ensure that we are in 'dev' environment; otherwise, do not seed!
if (process.env.NODE_ENV !== 'dev') {
  console.log('Database seeding can only be run in "dev" environment.')
  console.log('Nothing will be done.')
  process.exit(0)
} else {
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
}
