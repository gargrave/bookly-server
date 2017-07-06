const apiHelper = require('../../../api/utils/api-helper')
const bookMocks = require('../../../database/mocks/book-mocks')

const testHelpers = require('../../test-helpers')
const { login, testHttp } = testHelpers

const testUrl = 'http://localhost:3001/api/v1/books'

describe('API ROUTE: /books/ (GET: list) -> ', () => {
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

  describe('Authenticated, request owned Book ->', () => {
    beforeEach(async () => {
      user = await login()

      const ownedId = bookMocks.getOwnedRecordId(user.id)
      const url = `${testUrl}/${ownedId}`
      const request = apiHelper.axGet(url, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return a valid Book if the ID is owned by this User', async () => {
      expect(response).to.be.an.object()
      expect(response.id).to.not.be.undefined()
      expect(response.title).to.not.be.undefined()
      expect(response.author).to.not.be.undefined()
      expect(response.author.id).to.not.be.undefined()
      expect(response.author.name).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
    })
  })

  describe('Authenticated, request unowned Book ->', () => {
    beforeEach(async () => {
      user = await login()

      const unownedId = bookMocks.getUnownedRecordId(user.id)
      const url = `${testUrl}/${unownedId}`
      const request = apiHelper.axGet(url, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return an error if the ID is not owned by this User', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('No Book with id')).to.not.equal(-1)
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
      expect(response.message.indexOf('No Book with id')).to.not.equal(-1)
    })
  })
})
