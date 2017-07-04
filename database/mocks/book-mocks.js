'use strict'

let data = [
  { ownerId: 1, authorId: 1, title: 'Mother Night' },
  { ownerId: 1, authorId: 1, title: 'Slapstick' },
  { ownerId: 1, authorId: 1, title: 'Slaughterhouse Five' },
  { ownerId: 1, authorId: 1, title: 'The Sirens of Titan' },
  { ownerId: 1, authorId: 2, title: 'Fight Club' },
  { ownerId: 1, authorId: 2, title: 'Choke' },
  { ownerId: 1, authorId: 2, title: 'Survivor' },
  { ownerId: 1, authorId: 3, title: 'Even Cowgirls Get the Blues' },
  { ownerId: 1, authorId: 3, title: 'Jitterbug Perfume' },
  { ownerId: 1, authorId: 3, title: 'Half Asleep in Frog Pajamas' },

  { ownerId: 2, authorId: 4, title: 'A Walk in the Woods' },
  { ownerId: 2, authorId: 4, title: 'The Life and Times of the Thunderbolt Kid' },
  { ownerId: 2, authorId: 5, title: 'Island' },
  { ownerId: 2, authorId: 5, title: 'Brave New World' },
  { ownerId: 2, authorId: 6, title: 'Cather in the Rye' },
  { ownerId: 2, authorId: 7, title: 'The Trial' },
  { ownerId: 2, authorId: 7, title: 'The Metamorphasis' }
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
