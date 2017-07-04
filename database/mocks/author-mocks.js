'use strict'

let data = [
  { owner_id: 1, first_name: 'Kurt', last_name: 'Vonnegut' },
  { owner_id: 1, first_name: 'Chuck', last_name: 'Palahniuk' },
  { owner_id: 1, first_name: 'Tom', last_name: 'Robbins' },

  { owner_id: 2, first_name: 'Bill', last_name: 'Bryson' },
  { owner_id: 2, first_name: 'Aldous', last_name: 'Huxley' },
  { owner_id: 2, first_name: 'J. D.', last_name: 'Salinger' },
  { owner_id: 2, first_name: 'Franz', last_name: 'Kafka' }
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
      first_name: payload.first_name,
      last_name: payload.last_name
    }
    data.push(author)
    return author
  }
}
