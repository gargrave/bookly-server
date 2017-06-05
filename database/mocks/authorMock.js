'use strict'

let data = [
  { firstName: 'Kurt', lastName: 'Vonnegut' },
  { firstName: 'Chuck', lastName: 'Palahniuk' },
  { firstName: 'Tim', lastName: 'Robbins' },
  { firstName: 'Bill', lastName: 'Bryson' },
  { firstName: 'Aldous', lastName: 'Huxley' },
  { firstName: 'J. D.', lastName: 'Salinger' },
  { firstName: 'Franz', lastName: 'Kafka' }
]

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
