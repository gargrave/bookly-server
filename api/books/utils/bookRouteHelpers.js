module.exports = {
  selectCols: [
    'Books.id', 'Books.title', 'Books.created_at', 'Books.updated_at',
    'Books.authorId', 'Authors.firstName', 'Authors.lastName'
  ],

  populateAuthor: function (reply) {
    if (Array.isArray(reply)) {
      for (let book of reply) {
        parseBook(book)
      }
    } else {
      parseBook(reply)
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

    return reply
  }
}
