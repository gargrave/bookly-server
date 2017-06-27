const baseUrl = 'http://localhost:8080/#'
const confirmUrl = `${baseUrl}/account/passwordreset/confim?token=`

module.exports = {
  subject (config) {
    return 'Password Reset Link for Bookly Account'
  },

  text (config) {
    return `
    Use the following link to reset your password
    ${confirmUrl}${config.token}
    `
  },

  html (config) {
    return `
    <p>Use the following link to reset your password.</p>
    <p><a>${confirmUrl}${config.token}</a></p>
    `
  }
}
