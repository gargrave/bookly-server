'use strict'

// the hashed value of the word 'password'
const pwHash = '$2a$10$YhBtj94q/jeoPL4K2x5AvusAJ8m/kGY4K.wAB2Dulgpp2RDIF0G6W'

let data = [
  { email: 'qwer@email.com', password: pwHash },
  { email: 'asdf@email.com', password: pwHash },
  { email: 'norecords@email.com', password: pwHash },
  { email: 'onerecord@email.com', password: pwHash }
]

module.exports = {
  userWithData: { email: data[0].email, password: 'password' },
  userWithNoData: { email: data[2].email, password: 'password' },
  userWithOneRecord: { email: data[3].email, password: 'password' },

  get () {
    return data
  },

  find (id) {
    return data.find(record => record.id === id)
  },

  create (payload) {
    const record = {
      id: data.length,
      email: payload.email,
      password: payload.password
    }
    data.push(record)
    return record
  }
}
