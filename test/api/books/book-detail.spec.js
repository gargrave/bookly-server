const apiHelper = require('../../../api/utils/api-helper')
const bookMocks = require('../../../database/mocks/book-mocks')

const testHelper = require('../../test-helper')
const { login, testHttp } = testHelper

const bookDetailUrl = 'http://localhost:3001/api/v1/books'

describe('API ROUTE: /books/ (GET: list) -> ', () => {
  let user
  let response

  describe('Not Authenticated ->', () => {
    beforeEach((done) => {
      let request = apiHelper.axGet(bookDetailUrl)
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

  describe('Authenticated, request owned Book ->', () => {
    beforeEach((done) => {
      user = null

      login().then(userData => {
        user = userData
        const ownedId = bookMocks.getOwnedRecordId(user.id)
        const url = `${bookDetailUrl}/${ownedId}`
        let request = apiHelper.axGet(url, user.token)

        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should return a valid Book if the ID is owned by this User', (done) => {
      expect(response).to.be.an.object()
      expect(response.id).to.not.be.undefined()
      expect(response.title).to.not.be.undefined()
      expect(response.author).to.not.be.undefined()
      expect(response.author.id).to.not.be.undefined()
      expect(response.author.name).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
      done()
    })
  })

  describe('Authenticated, request unowned Book ->', () => {
    beforeEach((done) => {
      user = null

      login().then(userData => {
        user = userData
        const unownedId = bookMocks.getUnownedRecordId(user.id)
        const url = `${bookDetailUrl}/${unownedId}`
        let request = apiHelper.axGet(url, user.token)

        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should return an error if the ID is not owned by this User', (done) => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('No Book with id')).to.not.equal(-1)
      done()
    })
  })

  describe('Authenticated, request with invalid ID ->', () => {
    beforeEach((done) => {
      user = null

      login().then(userData => {
        user = userData
        const invalidId = 97531
        const url = `${bookDetailUrl}/${invalidId}`
        let request = apiHelper.axGet(url, user.token)

        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should return an error if the ID is not valid', (done) => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('No Book with id')).to.not.equal(-1)
      done()
    })
  })
})
