'use strict'

let data = [
  { ownerId: 1, authorId: 1, title: 'Mother Night' },
  { ownerId: 1, authorId: 3, title: 'Even Cowgirls Get the Blues' },
  { ownerId: 1, authorId: 6, title: 'Nine Stories' },
  { ownerId: 1, authorId: 1, title: 'Slapstick' },
  { ownerId: 1, authorId: 5, title: 'The Doors of Perception' },
  { ownerId: 1, authorId: 4, title: 'A Short History of Nearly Everything' },
  { ownerId: 1, authorId: 2, title: 'Fight Club' },
  { ownerId: 1, authorId: 1, title: 'Slaughterhouse Five' },
  { ownerId: 1, authorId: 7, title: 'The Metamorphasis' },
  { ownerId: 1, authorId: 3, title: 'Jitterbug Perfume' },

  { ownerId: 2, authorId: 9, title: 'Choke' },
  { ownerId: 2, authorId: 11, title: 'The Life and Times of the Thunderbolt Kid' },
  { ownerId: 2, authorId: 12, title: 'Island' },
  { ownerId: 2, authorId: 8, title: 'The Sirens of Titan' },
  { ownerId: 2, authorId: 12, title: 'Half Asleep in Frog Pajamas' },
  { ownerId: 2, authorId: 9, title: 'Survivor' },
  { ownerId: 2, authorId: 14, title: 'The Trial' },
  { ownerId: 2, authorId: 11, title: 'A Walk in the Woods' },
  { ownerId: 2, authorId: 12, title: 'Brave New World' },
  { ownerId: 2, authorId: 13, title: 'Cather in the Rye' }
]

module.exports = {
  get () {
    return data
  },

  find (id) {
    return data.find(record => record.id === id)
  },

  create (payload) {
    const author = {
      id: data.length,
      authorId: payload.authorId,
      title: payload.title
    }
    data.push(author)
    return author
  }
}
