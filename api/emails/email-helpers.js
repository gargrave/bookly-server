const env = require('../../globals/env')
const log = require('../../globals/logger').verboseLog

const from = 'Bookly Admin <no-reply@bookly-app.us>'

module.exports = {
  buildEmail (config, template) {
    return {
      from,
      to: config.to,
      subject: template.subject(config),
      text: template.text(config),
      html: template.html(config)
    }
  },

  showResults (emailName, err, body) {
    if (env.isDevEnv()) {
      if (err) {
        console.error(`Error sending "${emailName}" email:`)
        console.error(err)
      }
      if (body) {
        console.log(`"${emailName}" email successfully sent!`)
        console.log(body)
      }
    }
  },

  dumpToConsole (mail) {
    console.log('\nThe following email has been dumped to console for dev environment:\n')
    log([
      `From: ${mail.from}`,
      `To: ${mail.to}`,
      `Subject: ${mail.subject}`,
      '',
      '(Message HTML content is below)'
    ])
    console.log(mail.html)
  }
}
