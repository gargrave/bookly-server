const env = require('../../globals/env')

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
  }
}
