const axios = require('axios')

const apiHelper = require('../api/utils/api-helper')

const utils = require('../api/utils/utils')

module.exports = {
  async testHttp (request) {
    try {
      let res = await axios(request)
      return res
    } catch (err) {
      return { data: utils.parseError(err) }
    }
  },

  async login () {
    const loginUrl = 'http://localhost:3001/api/v1/auth/login'
    const testUser = { email: 'asdf@email.com', password: 'password' }

    try {
      let request = apiHelper.axPost(loginUrl, testUser)
      let res = await axios(request)
      return res.data.token
    } catch (err) {
      return { data: utils.parseError(err) }
    }
  }
}
