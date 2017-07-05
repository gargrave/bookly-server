const axios = require('axios')

const apiHelper = require('../api/utils/api-helper')
const userMocks = require('../database/mocks/user-mocks')

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

  async login (loginUser) {
    const loginUrl = 'http://localhost:3001/api/v1/auth/login'
    const user = loginUser || userMocks.userWithData

    try {
      let request = apiHelper.axPost(loginUrl, user)
      let res = await axios(request)
      return res.data
    } catch (err) {
      return { data: utils.parseError(err) }
    }
  }
}
