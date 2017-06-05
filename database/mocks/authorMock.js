'use strict'

let data = [
  { id: 0, firstName: 'Kurt', lastName: 'Vonnnegut' },
  { id: 1, firstName: 'Chuck', lastName: 'Palahniuk' },
  { id: 2, firstName: 'Tim', lastName: 'Robbins' },
  { id: 3, firstName: 'Bill', lastName: 'Bryson' },
  { id: 4, firstName: 'Aldous', lastName: 'Huxley' },
  { id: 5, firstName: 'J. D.', lastName: 'Salinger' },
  { id: 6, firstName: 'Franz', lastName: 'Kafka' }
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
