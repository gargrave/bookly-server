const apiHelper = require('../../../api/utils/api-helper')

const testHelper = require('../../test-helper')
const { login, testHttp } = testHelper

const booksUrl = 'http://localhost:3001/api/v1/books'

describe('API ROUTE: /books/ (GET: list) -> ', () => {
  let response

  describe('Not Authenticated ->', () => {
    before((done) => {
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
  })

  describe('Not Authenticated ->', () => {
    before((done) => {
      let request = apiHelper.axGet(booksUrl)
      // send the HTTP request
      testHttp(request).then(res => {
        response = res.data
        done()
      })
    })

    it('should return a 401 error if an invalid token is provided', (done) => {
      expect(response.statusCode).to.equal(401)
      expect(response.message).to.not.be.undefined()
      done()
    })
  })

  describe('Authenticated ->', () => {
    before((done) => {
      login().then(token => {
        let request = apiHelper.axGet(booksUrl, token)
        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should provide an Array of Books if proper authentication is provided', (done) => {
      let books = response
      let book = books[0]

      expect(books).to.be.an.array()
      expect(books.length > 0).to.be.true()

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
})
