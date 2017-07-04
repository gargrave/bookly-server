const DB = require('../../../globals/constants').db

module.exports = {
  params: {
    path: 'books',
    db: DB.BOOKS,
    resourceName: 'Book'
  },

  selectCols: [
    `${DB.BOOKS}.id`, `${DB.BOOKS}.title`, `${DB.BOOKS}.created_at`, `${DB.BOOKS}.updated_at`,
    `${DB.BOOKS}.author_id`, `${DB.AUTHORS}.first_name`, `${DB.AUTHORS}.last_name`
  ],

  selectColsWithoutAuthor: [
    'id', 'title', 'created_at', 'updated_at', 'author_id'
  ],

  buildPayload (payload) {
    return {
      owner_id: payload.owner_id,
      title: payload.title,
      author_id: payload.authorId
    }
  },

  populateAuthor: function (bookQueryResult) {
    if (Array.isArray(bookQueryResult)) {
      for (let book of bookQueryResult) {
        parseBook(book)
      }
    } else {
      parseBook(bookQueryResult)
    }

    function parseBook (book) {
      // build a cleaner version of the author
      book.author = {
        id: book.author_id,
        name: `${book.first_name} ${book.last_name}`
      }

      // remove the original fields
      delete book.author_id
      delete book.first_name
      delete book.last_name
    }

    return bookQueryResult
  }
}
