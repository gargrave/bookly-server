const JWT = require('jsonwebtoken')

module.exports = {
  selectCols: ['id', 'email', 'created_at', 'updated_at', 'last_login', 'verified'],

  /**
   * Builds a JWT based on the provided user data
   *
   * The user data should contain the following:
   *    id - The primary key for the User in the DB
   *    email - The User's registered email address
   *
   * @param {Object} user The user from whom a JWT should be generated.
   */
  buildJWT (user) {
    const { id, email } = user
    const jwtData = { id, email }
    const duration = Number(process.env.JWT_DEFAULT_DURATION) || (60 * 60)
    const jwtOptions = { expiresIn: duration }
    const token = JWT.sign(jwtData, process.env.AUTH_SECRET_KEY, jwtOptions)

    return token
  }
}
