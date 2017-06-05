const DB = require('../../globals/constants').db
const data = require('../mocks/booksMock').get()

exports.seed = (Knex, Promise) => {
  return new Promise((resolve, reject) => {
    return Knex(DB.BOOKS)
      .insert(data)
      .then(resolve)
  })
}
