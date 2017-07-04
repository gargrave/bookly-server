const DB = require('../../globals/constants').db
const data = require('../mocks/book-mocks').get()

const SQL_REST = `ALTER SEQUENCE "${DB.BOOKS}_id_seq" RESTART WITH 1; UPDATE "${DB.BOOKS}" SET id = DEFAULT;`

exports.seed = (Knex, Promise) => {
  return new Promise((resolve, reject) => {
    return Knex(DB.BOOKS).del()
      .then(() => {
        return Knex.raw(SQL_REST)
          .then(() => {
            return Knex(DB.BOOKS)
              .insert(data)
              .then(resolve)
          })
      })
  })
}
