'use strict'

const apiErrors = require('../../../api/utils/api-errors')
const apiHelper = require('../../../api/utils/api-helper')

const testHelpers = require('../../test-helpers')
const { testHttp } = testHelpers

const testUrl = 'http://localhost:3001/api/v1/auth/login'

describe('API ROUTE: auth/login -> ', () => {
  let response

  afterEach(async () => {
    response = null
  })

  describe('Logging in with missing credentials ->', () => {
    before(async () => {
      const request = apiHelper.axPost(testUrl)
      request.data = { email: 'invalidemail@email.com' }
      const res = await testHttp(request)
      response = res.data
    })

    it('should return a validation message if provided missing credentials', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.validation).to.not.be.undefined()
    })
  })

  describe('Logging in with invalid credentials ->', () => {
    before(async () => {
      const request = apiHelper.axPost(testUrl)
      request.data = { email: 'invalidemail@email.com', password: 'invalidpassword' }
      const res = await testHttp(request)
      response = res.data
    })

    it('should return a clean error message if provided invalid credentials', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message).to.equal(apiErrors.invalidLogin())
    })
  })

  describe('Logging in with valid credentials ->', () => {
    before(async () => {
      const request = apiHelper.axPost(testUrl)
      request.data = { email: 'asdf@email.com', password: 'password' }
      const res = await testHttp(request)
      response = res.data
    })

    it('should return a token and user data if provided with correct credentials', async () => {
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
    })
  })
})
