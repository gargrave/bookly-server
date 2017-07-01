const mg = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_API_URL
})

const env = require('../../globals/env')

module.exports = {
  sendVerifyAccount (config) {
    if (env.isDevEnv() && process.env.DUMP_DEV_EMAILS_TO_CONSOLE) {
      require('./handlers/verify').dump(config)
    } else {
      require('./handlers/verify').send(mg, config)
    }
  },

  sendPasswordReset (config) {
    if (env.isDevEnv() && process.env.DUMP_DEV_EMAILS_TO_CONSOLE) {
      require('./handlers/pwreset-request').dump(config)
    } else {
      require('./handlers/pwreset-request').send(mg, config)
    }
  }
}
