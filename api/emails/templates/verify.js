const baseUrl = process.env.CLIENT_BASE_URL
const url = `${baseUrl}/account/verify`

module.exports = {
  subject (config) {
    return 'Please Verify Your Bookly Account'
  },

  text (config) {
    return `
    Please copy/paste the link below into your browser to verify your account.
    ${url}?token=${config.token}
    `
  },

  html (config) {
    return `
    <p>Please either click the link below or copy/paste it into your browser to verify your account.</p>
    <p><a>${url}?token=${config.token}</a></p>
    `
  }
}
