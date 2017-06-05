const data = require('../mocks/authorMock').get()

exports.seed = (Knex, Promise) => {
  return new Promise((resolve, reject) => {
    return Knex('Author')
      .insert(data)
      .then(resolve)
  })
}
