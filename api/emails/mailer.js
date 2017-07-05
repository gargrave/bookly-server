const mg = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_API_URL
})

const env = require('../../globals/env')

const dumpEmails = (env.isDevEnv() && process.env.DUMP_DEV_EMAILS_TO_CONSOLE)

function processMail (mail, config) {
  if (dumpEmails) {
    mail.dump(config)
  } else {
    mail.send(mg, config)
  }
}

module.exports = {
  sendVerifyAccount (config) {
    processMail(require('./handlers/verify'), config)
  },

  sendPasswordReset (config) {
    processMail(require('./handlers/pwreset-request'), config)
  }
}
