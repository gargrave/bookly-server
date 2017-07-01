/*
A simple file to export all route paths.
This is nothing more than a convenience to keep our main index.js file a little cleaner.
*/
module.exports = [
  // Auth routes
  './api/auth/routes/auth-register',
  './api/auth/routes/auth-login',
  './api/auth/routes/user-detail',
  './api/auth/routes/verify-account',
  './api/auth/routes/verify-resend',
  './api/auth/routes/pwreset-request',
  './api/auth/routes/pwreset-confirm',

  // Author routes
  './api/authors/routes/createAuthor',
  './api/authors/routes/detailAuthor',
  './api/authors/routes/listAuthors',
  './api/authors/routes/updateAuthor',
  './api/authors/routes/deleteAuthor',

  // Book routes
  './api/books/routes/createBook',
  './api/books/routes/detailBook',
  './api/books/routes/listBooks',
  './api/books/routes/updateBook',
  './api/books/routes/deleteBook'
]
