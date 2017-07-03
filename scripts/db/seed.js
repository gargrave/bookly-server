const knex = require('../../database/db')
const log = require('../../globals/logger').verboseLog

const config = {
  directory: './database/seeds/'
}

// ensure that we are in 'dev' or 'test' environment; otherwise, do not seed!
const canSeed = (process.env.NODE_ENV === 'dev') || (process.env.NODE_ENV === 'test')
if (!canSeed) {
  log([
    'DB seeding can only proceed in "dev" and "test" environments.',
    'Nothing will be done.'
  ])
  process.exit(0)
} else {
  knex.seed.run(config)
    .then(res => {
      log('DB seeding successful!')
      process.exit(0)
    })
    .catch(err => {
      log('DB seeding error!')
      console.log(err)
      process.exit(1)
    })
}
