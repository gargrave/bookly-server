'use strict'

const data = require('../seeds/authorSeeds').data

module.exports = {
  get () {
    return data
  },

  find (id) {
    return data.find(author => author.id === id)
  },

  create (payload) {
    const author = {
      id: data.length,
      firstName: payload.firstName,
      lastName: payload.lastName
    }
    data.push(author)
    return author
  }
}
