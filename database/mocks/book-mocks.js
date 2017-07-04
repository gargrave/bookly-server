'use strict'

let data = [
  { owner_id: 1, author_id: 1, title: 'Mother Night' },
  { owner_id: 1, author_id: 1, title: 'Slapstick' },
  { owner_id: 1, author_id: 1, title: 'Slaughterhouse Five' },
  { owner_id: 1, author_id: 1, title: 'The Sirens of Titan' },
  { owner_id: 1, author_id: 2, title: 'Fight Club' },
  { owner_id: 1, author_id: 2, title: 'Choke' },
  { owner_id: 1, author_id: 2, title: 'Survivor' },
  { owner_id: 1, author_id: 3, title: 'Even Cowgirls Get the Blues' },
  { owner_id: 1, author_id: 3, title: 'Jitterbug Perfume' },
  { owner_id: 1, author_id: 3, title: 'Half Asleep in Frog Pajamas' },

  { owner_id: 2, author_id: 4, title: 'A Walk in the Woods' },
  { owner_id: 2, author_id: 4, title: 'The Life and Times of the Thunderbolt Kid' },
  { owner_id: 2, author_id: 5, title: 'Island' },
  { owner_id: 2, author_id: 5, title: 'Brave New World' },
  { owner_id: 2, author_id: 6, title: 'Cather in the Rye' },
  { owner_id: 2, author_id: 7, title: 'The Trial' },
  { owner_id: 2, author_id: 7, title: 'The Metamorphasis' }
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
      author_id: payload.author_id,
      title: payload.title
    }
    data.push(author)
    return author
  }
}
