const apiHelper = require('../../../api/utils/api-helper')
const authorMocks = require('../../../database/mocks/author-mocks')
const userMocks = require('../../../database/mocks/user-mocks')

const testHelper = require('../../test-helper')
const { login, testHttp } = testHelper

const authorsUrl = 'http://localhost:3001/api/v1/authors'

describe('API ROUTE: /authors/ (GET: list) -> ', () => {
  let user
  let response

  afterEach(async () => {
    user = null
    response = null
  })

  describe('Not Authenticated ->', () => {
    beforeEach(async () => {
      let request = apiHelper.axGet(authorsUrl)
      let res = await testHttp(request)
      response = res.data
    })

    it('should return a 401 error if no token is provided', (done) => {
      expect(response.statusCode).to.equal(401)
      expect(response.message).to.not.be.undefined()
      done()
    })

    it('should return a 401 error if an invalid token is provided', (done) => {
      expect(response.statusCode).to.equal(401)
      expect(response.message).to.not.be.undefined()
      done()
    })
  })

  describe('Authenticated, user has records ->', () => {
    beforeEach(async () => {
      user = await login()

      const request = apiHelper.axGet(authorsUrl, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should provide an Array of Authors if proper authentication is provided', (done) => {
      let authors = response
      let author = authors[0]
      let expectedLength = authorMocks.get().filter(a => a.owner_id === user.id).length

      expect(authors).to.be.an.array()
      expect(authors.length).to.equal(expectedLength)

      expect(author.id).to.not.be.undefined()
      expect(author.first_name).to.not.be.undefined()
      expect(author.last_name).to.not.be.undefined()
      expect(author.created_at).to.not.be.undefined()
      expect(author.updated_at).to.not.be.undefined()

      done()
    })
  })

  describe('Authenticated, user has one record ->', () => {
    beforeEach(async () => {
      const loginUser = userMocks.userWithOneRecord
      user = await login(loginUser)

      const request = apiHelper.axGet(authorsUrl, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return an Array with a single element', (done) => {
      expect(response).to.be.an.array()
      expect(response.length).to.equal(1)
      done()
    })
  })

  describe('Authenticated, user has no records ->', () => {
    beforeEach(async () => {
      const loginUser = userMocks.userWithNoData
      user = await login(loginUser)

      const request = apiHelper.axGet(authorsUrl, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return an empty Array if the User has no authors', (done) => {
      expect(response).to.be.an.array()
      expect(response.length).to.equal(0)
      done()
    })
  })
})
