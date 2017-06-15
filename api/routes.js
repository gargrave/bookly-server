/*
A simple file to export all route paths.
This is nothing more than a convenience to keep our main index.js file a little cleaner.
*/
module.exports = [
  // Auth routes
  './api/auth/routes/register',
  './api/auth/routes/login',
  './api/auth/routes/userDetail',
  './api/auth/routes/profileDetail',

  // Author routes
  './api/authors/routes/createAuthor',
  './api/authors/routes/detailAuthor',
  './api/authors/routes/listAuthors',
  './api/authors/routes/updateAuthor',

  // Book routes
  './api/books/routes/createBook',
  './api/books/routes/detailBook',
  './api/books/routes/listBooks',
  './api/books/routes/updateBook',
  './api/books/routes/deleteBook'
]
