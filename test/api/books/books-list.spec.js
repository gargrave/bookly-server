'use strict'

const apiHelper = require('../../../api/utils/api-helper')
const bookMocks = require('../../../database/mocks/book-mocks')
const userMocks = require('../../../database/mocks/user-mocks')

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

  describe('Authenticated, user has records, no pagination ->', () => {
    beforeEach(async () => {
      user = await login()

      const request = apiHelper.axGet(testUrl, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should provide an Array of Authors if proper authentication is provided', async () => {
      const books = response.results
      const book = books[0]
      const expectedLength = bookMocks.get().filter(a => a.owner_id === user.id).length

      expect(books).to.be.an.array()
      expect(books.length).to.equal(expectedLength)

      expect(book.id).to.not.be.undefined()
      expect(book.title).to.not.be.undefined()
      expect(book.author).to.not.be.undefined()
      expect(book.author.id).to.not.be.undefined()
      expect(book.author.name).to.not.be.undefined()
      expect(book.created_at).to.not.be.undefined()
      expect(book.updated_at).to.not.be.undefined()
    })
  })

  describe('Authenticated, user has records, with pagination ->', () => {
    beforeEach(async () => {
      user = await login()

      const url = `${testUrl}?limit=2`
      const request = apiHelper.axGet(url, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should provide an Array of 2 Books when pagination options are provided', async () => {
      const books = response.results
      const book = books[0]
      const expectedLength = 2

      expect(books).to.be.an.array()
      expect(books.length).to.equal(expectedLength)

      expect(book.id).to.not.be.undefined()
      expect(book.title).to.not.be.undefined()
      expect(book.author).to.not.be.undefined()
      expect(book.author.id).to.not.be.undefined()
      expect(book.author.name).to.not.be.undefined()
      expect(book.created_at).to.not.be.undefined()
      expect(book.updated_at).to.not.be.undefined()
    })
  })

  describe('Authenticated, user has one record ->', () => {
    beforeEach(async () => {
      const loginUser = userMocks.userWithOneRecord
      user = await login(loginUser)

      const request = apiHelper.axGet(testUrl, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return an Array with a single element', async () => {
      const books = response.results

      expect(books).to.be.an.array()
      expect(books.length).to.equal(1)
    })
  })

  describe('Authenticated, user has no records ->', () => {
    beforeEach(async () => {
      const loginUser = userMocks.userWithNoData
      user = await login(loginUser)

      const request = apiHelper.axGet(testUrl, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should return an empty Array if the User has no books', async () => {
      const books = response.results

      expect(books).to.be.an.array()
      expect(books.length).to.equal(0)
    })
  })
})
