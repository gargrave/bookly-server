const DB = require('../../globals/constants').db
const data = require('../mocks/authorMock').get()

exports.seed = (Knex, Promise) => {
  return new Promise((resolve, reject) => {
    return Knex(DB.AUTHORS)
      .insert(data)
      .then(resolve)
  })
}
