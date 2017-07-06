'use strict'

const apiHelper = require('../../../api/utils/api-helper')
const authorMocks = require('../../../database/mocks/author-mocks')

const testHelpers = require('../../test-helpers')
const { login, testHttp } = testHelpers

const testUrl = 'http://localhost:3001/api/v1/authors'

describe('API ROUTE: /authors/ (GET: list) -> ', () => {
  let user
  let response

  afterEach(async () => {
    user = null
    response = null
  })

  describe('Not Authenticated ->', () => {
    beforeEach(async () => {
      const request = apiHelper.axGet(testUrl)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return a 401 error if no token is provided', async () => {
      expect(response.statusCode).to.equal(401)
      expect(response.message).to.not.be.undefined()
    })

    it('should return a 401 error if an invalid token is provided', async () => {
      expect(response.statusCode).to.equal(401)
      expect(response.message).to.not.be.undefined()
    })
  })

  describe('Authenticated, request owned Author ->', () => {
    beforeEach(async () => {
      user = await login()

      const ownedId = authorMocks.getOwnedRecordId(user.id)
      const url = `${testUrl}/${ownedId}`
      const request = apiHelper.axGet(url, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return a valid Author if the ID is owned by this User', async () => {
      expect(response).to.be.an.object()
      expect(response.id).to.not.be.undefined()
      expect(response.first_name).to.not.be.undefined()
      expect(response.last_name).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
    })
  })

  describe('Authenticated, request unowned Author ->', () => {
    beforeEach(async () => {
      user = await login()

      const unownedId = authorMocks.getUnownedRecordId(user.id)
      const url = `${testUrl}/${unownedId}`
      const request = apiHelper.axGet(url, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return an error if the ID is not owned by this User', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('No Author with id')).to.not.equal(-1)
    })
  })

  describe('Authenticated, request with invalid ID ->', () => {
    beforeEach(async () => {
      user = await login()

      const invalidId = 97531
      const url = `${testUrl}/${invalidId}`
      const request = apiHelper.axGet(url, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return an error if the ID is not valid', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('No Author with id')).to.not.equal(-1)
    })
  })
})
