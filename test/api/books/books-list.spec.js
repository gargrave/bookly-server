const apiHelper = require('../../../api/utils/api-helper')
const bookMocks = require('../../../database/mocks/book-mocks')
const userMocks = require('../../../database/mocks/user-mocks')

const testHelper = require('../../test-helper')
const { login, testHttp } = testHelper

const booksUrl = 'http://localhost:3001/api/v1/books'

describe('API ROUTE: /books/ (GET: list) -> ', () => {
  let user
  let response

  describe('Not Authenticated ->', () => {
    beforeEach((done) => {
      let request = apiHelper.axGet(booksUrl)
      // send the HTTP request
      testHttp(request).then(res => {
        response = res.data
        done()
      })
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

  describe('Authenticated, user has records  ->', () => {
    beforeEach((done) => {
      user = null
      login().then(userData => {
        user = userData
        let request = apiHelper.axGet(booksUrl, user.token)
        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should return an Array of Books if proper authentication is provided', (done) => {
      let books = response
      let book = books[0]
      let expectedLength = bookMocks.get().filter(a => a.owner_id === user.id).length

      expect(books).to.be.an.array()
      expect(books.length).to.equal(expectedLength)

      expect(book.id).to.not.be.undefined()
      expect(book.title).to.not.be.undefined()
      expect(book.author).to.not.be.undefined()
      expect(book.author.id).to.not.be.undefined()
      expect(book.author.name).to.not.be.undefined()
      expect(book.created_at).to.not.be.undefined()
      expect(book.updated_at).to.not.be.undefined()

      done()
    })
  })

  describe('Authenticated, user has one record ->', () => {
    beforeEach((done) => {
      user = null
      const loginUser = userMocks.userWithOneRecord
      login(loginUser).then(userData => {
        user = userData
        let request = apiHelper.axGet(booksUrl, user.token)
        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should return an Array with a single element', (done) => {
      expect(response).to.be.an.array()
      expect(response.length).to.equal(1)
      done()
    })
  })

  describe('Authenticated, user has no records ->', () => {
    beforeEach((done) => {
      user = null
      const loginUser = userMocks.userWithNoData
      login(loginUser).then(userData => {
        user = userData
        let request = apiHelper.axGet(booksUrl, user.token)
        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should return an empty Array if the User has no books', (done) => {
      expect(response).to.be.an.array()
      expect(response.length).to.equal(0)
      done()
    })
  })
})
