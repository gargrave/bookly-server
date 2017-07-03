const DB = require('../../../globals/constants').db

module.exports = {
  params: {
    path: 'books',
    db: DB.BOOKS,
    resourceName: 'Book'
  },

  selectCols: [
    `${DB.BOOKS}.id`, `${DB.BOOKS}.title`, `${DB.BOOKS}.created_at`, `${DB.BOOKS}.updated_at`,
    `${DB.BOOKS}.authorId`, `${DB.AUTHORS}.firstName`, `${DB.AUTHORS}.lastName`
  ],

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
        id: book.authorId,
        name: `${book.firstName} ${book.lastName}`
      }

      // remove the original fields
      delete book.authorId
      delete book.firstName
      delete book.lastName
    }

    return bookQueryResult
  }
}
