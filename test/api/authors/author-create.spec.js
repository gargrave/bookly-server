const apiHelper = require('../../../api/utils/api-helper')

const testHelper = require('../../test-helper')
const { login, testHttp } = testHelper

const testUrl = 'http://localhost:3001/api/v1/authors'

describe('API ROUTE: /authors/ (GET: list) -> ', () => {
  let user
  let response

  afterEach(async () => {
    // delete the record we just created
    if (response.id) {
      const url = `${testUrl}/${response.id}`
      const request = apiHelper.axDelete(url, {}, user.token)
      await testHttp(request)
    }

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

  describe('Authenticated, valid request ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = { firstName: 'Best', lastName: 'Author' }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should successfully create a new Author when valid data is sent', async () => {
      expect(response).to.be.an.object()
      expect(response.id).to.not.be.undefined()
      expect(response.first_name).to.not.be.undefined()
      expect(response.last_name).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
    })
  })

  describe('Authenticated, bad request -> extra data ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = { firstName: 'Best', lastName: 'Author', extraProperty: 'ONOS' }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should successfully create a new Author when valid data is sent', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('"extraProperty" is not allowed')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> blank first name ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = { lastName: 'Best', firstName: '' }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject an Author with blank first name', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('child "firstName" fails')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> missing first name ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = { lastName: 'Best' }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject an Author with missing first name', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('child "firstName" fails')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> blank last name ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = { firstName: 'Best', lastName: '' }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject an Author with blank last name', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('child "lastName" fails')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> missing last name ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = { firstName: 'Best' }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject an Author with missing last name', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('child "lastName" fails')).to.not.equal(-1)
    })
  })
})
