const apiHelper = require('../../../api/utils/api-helper')

const testHelper = require('../../test-helper')
const { login, testHttp } = testHelper

const authorsUrl = 'http://localhost:3001/api/v1/authors'

describe('API ROUTE: /authors/ (GET: list) -> ', () => {
  let response

  describe('Not Authenticated ->', () => {
    before((done) => {
      let request = apiHelper.axGet(authorsUrl)
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
      let request = apiHelper.axGet(authorsUrl)
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
        let request = apiHelper.axGet(authorsUrl, token)
        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should provide an Array of Authors if proper authentication is provided', (done) => {
      let authors = response
      let author = authors[0]

      expect(authors).to.be.an.array()
      expect(authors.length > 0).to.be.true()

      expect(author.id).to.not.be.undefined()
      expect(author.firstName).to.not.be.undefined()
      expect(author.lastName).to.not.be.undefined()
      expect(author.created_at).to.not.be.undefined()
      expect(author.updated_at).to.not.be.undefined()

      done()
    })
  })
})
