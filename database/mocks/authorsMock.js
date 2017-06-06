'use strict'

let data = [
  { ownerId: 1, firstName: 'Kurt', lastName: 'Vonnegut' },
  { ownerId: 1, firstName: 'Chuck', lastName: 'Palahniuk' },
  { ownerId: 1, firstName: 'Tom', lastName: 'Robbins' },
  { ownerId: 1, firstName: 'Bill', lastName: 'Bryson' },
  { ownerId: 1, firstName: 'Aldous', lastName: 'Huxley' },
  { ownerId: 1, firstName: 'J. D.', lastName: 'Salinger' },
  { ownerId: 1, firstName: 'Franz', lastName: 'Kafka' },

  { ownerId: 2, firstName: 'Kurt', lastName: 'Vonnegut' },
  { ownerId: 2, firstName: 'Chuck', lastName: 'Palahniuk' },
  { ownerId: 2, firstName: 'Tom', lastName: 'Robbins' },
  { ownerId: 2, firstName: 'Bill', lastName: 'Bryson' },
  { ownerId: 2, firstName: 'Aldous', lastName: 'Huxley' },
  { ownerId: 2, firstName: 'J. D.', lastName: 'Salinger' },
  { ownerId: 2, firstName: 'Franz', lastName: 'Kafka' }
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
