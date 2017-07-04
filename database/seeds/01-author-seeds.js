const DB = require('../../globals/constants').db
const data = require('../mocks/author-mocks').get()

const SQL_REST = `ALTER SEQUENCE "${DB.AUTHORS}_id_seq" RESTART WITH 1; UPDATE "${DB.AUTHORS}" SET id = DEFAULT;`

exports.seed = (Knex, Promise) => {
  return new Promise((resolve, reject) => {
    return Knex(DB.AUTHORS).del()
      .then(() => {
        return Knex.raw(SQL_REST)
          .then(() => {
            return Knex(DB.AUTHORS)
              .insert(data)
              .then(resolve)
          })
      })
  })
}
