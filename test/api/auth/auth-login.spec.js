const axios = require('axios')

const apiErrors = require('../../../api/utils/apiErrors')
const utils = require('../../../api/utils/utils')

function getDefaultRequset () {
  return {
    method: 'post',
    headers: {
      'Accept': 'application/json'
    },
    url: 'http://localhost:3001/api/v1/auth/login'
  }
}

async function testHttp (request) {
  try {
    let res = await axios(request)
    return res
  } catch (err) {
    return { data: utils.parseError(err) }
  }
}

describe('API ROUTE: auth/login -> ', () => {
  let request
  let response

  describe('Logging in with missing credentials ->', () => {
    before((done) => {
      request = getDefaultRequset()
      request.data = { email: 'invalidemail@email.com' }
      // send the HTTP request
      testHttp(request).then(res => {
        response = res.data
        done()
      })
    })

    it('should return a validation message if provided missing credentials', (done) => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.validation).to.not.be.undefined()
      done()
    })
  })

  describe('Logging in with invalid credentials ->', () => {
    before((done) => {
      request = getDefaultRequset()
      request.data = { email: 'invalidemail@email.com', password: 'invalidpassword' }
      // send the HTTP request
      testHttp(request).then(res => {
        response = res.data
        done()
      })
    })

    it('should return a clean error message if provided invalid credentials', (done) => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message).to.equal(apiErrors.invalidLogin())
      done()
    })
  })

  describe('Logging in with valid credentials ->', () => {
    before((done) => {
      request = getDefaultRequset()
      request.data = { email: 'asdf@email.com', password: 'password' }
      // send the HTTP request
      testHttp(request).then(res => {
        response = res.data
        done()
      })
    })

    it('should return a token and user data if provided with correct credentials', (done) => {
      expect(response.message).to.be.undefined()
      // basic User fields
      expect(response.id).to.not.be.undefined()
      expect(response.email).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
      expect(response.verified).to.not.be.undefined()
      expect(response.token).to.not.be.undefined()
      // embedded Profile fields
      expect(response.profile).to.not.be.undefined()
      expect(response.profile.id).to.not.be.undefined()
      expect(response.profile.first_name).to.not.be.undefined()
      expect(response.profile.last_name).to.not.be.undefined()
      expect(response.profile.created_at).to.not.be.undefined()
      expect(response.profile.updated_at).to.not.be.undefined()
      done()
    })
  })
})
