module.exports = {
  getRandomToken (len = 48) {
    return require('crypto').randomBytes(len).toString('hex')
  },

  parseError (err) {
    if (err.response && err.response.data) {
      return err.response.data
    } else if (err.message) {
      return err
    }
    return { message: 'An unknown error occurred.' }
  }
}
