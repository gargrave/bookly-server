'use strict'

let data = [
  { authorId: 1, title: 'Mother Night' },
  { authorId: 3, title: 'Even Cowgirls Get the Blues' },
  { authorId: 6, title: 'Nine Stories' },
  { authorId: 1, title: 'Slapstick' },
  { authorId: 5, title: 'The Doors of Perception' },
  { authorId: 4, title: 'A Short History of Nearly Everything' },
  { authorId: 2, title: 'Fight Club' },
  { authorId: 1, title: 'Slaughterhouse Five' },
  { authorId: 7, title: 'The Metamorphasis' },
  { authorId: 3, title: 'Jitterbug Perfume' },
  { authorId: 2, title: 'Choke' },
  { authorId: 4, title: 'The Life and Times of the Thunderbolt Kid' },
  { authorId: 5, title: 'Island' },
  { authorId: 1, title: 'The Sirens of Titan' },
  { authorId: 3, title: 'Half Asleep in Frog Pajamas' },
  { authorId: 2, title: 'Survivor' },
  { authorId: 7, title: 'The Trial' },
  { authorId: 4, title: 'A Walk in the Woods' },
  { authorId: 5, title: 'Brave New World' },
  { authorId: 6, title: 'Cather in the Rye' }
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
