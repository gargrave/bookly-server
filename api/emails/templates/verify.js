const baseUrl = 'http://localhost:8080/#'
const confirmUrl = `${baseUrl}/account/verify?token=`

module.exports = {
  subject (config) {
    return 'Please Verify Your Bookly Account'
  },

  text (config) {
    return `
    Please copy/paste the link below into your browser to verify your account.
    ${confirmUrl}${config.token}
    `
  },

  html (config) {
    return `
    <p>Please either click the link below or copy/paste it into your browser to verify your account.</p>
    <p><a>${confirmUrl}${config.token}</a></p>
    `
  }
}
