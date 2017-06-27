const mg = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_API_URL
})

module.exports = {
  sendVerifyAccount (config) {
    require('./handlers/verify').send(mg, config)
  },

  sendPasswordReset (config) {
    require('./handlers/pwreset-request').send(mg, config)
  }
}
