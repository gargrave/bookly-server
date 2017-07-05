const emailHelpers = require('../email-helpers')

module.exports = {
  async send (mg, config) {
    const template = require('../templates/pwreset-request')
    mg.messages().send(emailHelpers.buildEmail(config, template), (err, body) => {
      emailHelpers.showResults('verify', err, body)
    })
  },

  async dump (config) {
    const template = require('../templates/pwreset-request')
    emailHelpers.dumpToConsole(emailHelpers.buildEmail(config, template))
  }
}
