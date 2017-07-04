const DB = require('../../globals/constants').db
const data = require('../mocks/usersMock').get()

const SQL_REST = `ALTER SEQUENCE "${DB.USERS}_id_seq" RESTART WITH 1; UPDATE "${DB.USERS}" SET id = DEFAULT;`

exports.seed = (Knex, Promise) => {
  return new Promise((resolve, reject) => {
    return Knex(DB.USERS).del()
      .then(() => {
        return Knex.raw(SQL_REST)
          .then(() => {
            return Knex(DB.USERS)
              .insert(data)
              .then(resolve)
          })
      })
  })
}
