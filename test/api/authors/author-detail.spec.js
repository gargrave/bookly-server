const apiHelper = require('../../../api/utils/api-helper')
const authorMocks = require('../../../database/mocks/author-mocks')

const testHelper = require('../../test-helper')
const { login, testHttp } = testHelper

const authorDetailUrl = 'http://localhost:3001/api/v1/authors'

describe('API ROUTE: /authors/ (GET: list) -> ', () => {
  let user
  let response

  describe('Not Authenticated ->', () => {
    beforeEach((done) => {
      let request = apiHelper.axGet(authorDetailUrl)
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

  describe('Authenticated, request owned Author ->', () => {
    beforeEach((done) => {
      user = null

      login().then(userData => {
        user = userData
        const ownedId = authorMocks.getOwnedRecordId(user.id)
        const url = `${authorDetailUrl}/${ownedId}`
        let request = apiHelper.axGet(url, user.token)

        // send the HTTP request
        testHttp(request).then(res => {
          response = res.data
          done()
        })
      })
    })

    it('should return a valid Author if the ID is owned by this User', (done) => {
      expect(response).to.be.an.object()
      expect(response.id).to.not.be.undefined()
      expect(response.first_name).to.not.be.undefined()
      expect(response.last_name).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
      done()
    })
  })

  describe('Authenticated, request unowned Author ->', () => {
    beforeEach((done) => {
      user = null

      login().then(userData => {
        user = userData
        const unownedId = authorMocks.getUnownedRecordId(user.id)
        const url = `${authorDetailUrl}/${unownedId}`
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
      expect(response.message.indexOf('No Author with id')).to.not.equal(-1)
      done()
    })
  })

  describe('Authenticated, request with invalid ID ->', () => {
    beforeEach((done) => {
      user = null

      login().then(userData => {
        user = userData
        const invalidId = 97531
        const url = `${authorDetailUrl}/${invalidId}`
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
      expect(response.message.indexOf('No Author with id')).to.not.equal(-1)
      done()
    })
  })
})
