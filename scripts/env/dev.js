const fs = require('fs')

if (process.env.NODE_ENV === 'dev') {
  // set up secret key for auth
  const keyFile = './etc/authSecretKey.txt'
  const key = fs.readFileSync(keyFile).toString()
  process.env.AUTH_SECRET_KEY = key.trim()
}
