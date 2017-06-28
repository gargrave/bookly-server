const baseUrl = process.env.CLIENT_BASE_URL
const url = `${baseUrl}/account/passwordreset/confim`

module.exports = {
  subject (config) {
    return 'Password Reset Link for Bookly Account'
  },

  text (config) {
    return `
    Use the following link to reset your password
    ${url}?token=${config.token}
    `
  },

  html (config) {
    return `
    <p>Use the following link to reset your password.</p>
    <p><a>${url}?token=${config.token}</a></p>
    `
  }
}
