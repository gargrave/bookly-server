const helpers = require('../email-helpers')

module.exports = {
  async send (mg, config) {
    const template = require('../templates/pwreset-request')
    mg.messages().send(helpers.buildEmail(config, template), (err, body) => {
      helpers.showResults('verify', err, body)
    })
  },

  async dump (config) {
    const template = require('../templates/pwreset-request')
    console.log(template.html(config))
  }
}
