module.exports = {
  getRandomToken (len = 48) {
    return require('crypto').randomBytes(len).toString('hex')
  }
}
