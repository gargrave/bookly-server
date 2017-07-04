/*
A simple file to export all route paths.
This is nothing more than a convenience to keep our main index.js file a little cleaner.
*/
module.exports = [
  // Auth routes
  './api/auth/routes/auth-login',
  './api/auth/routes/auth-register',
  './api/auth/routes/profile-update',
  './api/auth/routes/pwreset-confirm',
  './api/auth/routes/pwreset-request',
  './api/auth/routes/user-detail',
  './api/auth/routes/verify-account',
  './api/auth/routes/verify-resend',

  // Author routes
  './api/authors/routes/author-create',
  './api/authors/routes/author-delete',
  './api/authors/routes/author-detail',
  './api/authors/routes/author-update',
  './api/authors/routes/authors-list',

  // Book routes
  './api/books/routes/book-create',
  './api/books/routes/book-delete',
  './api/books/routes/book-detail',
  './api/books/routes/book-update',
  './api/books/routes/books-list'
]
