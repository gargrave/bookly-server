'use strict'

const apiHelper = require('../../../api/utils/api-helper')
const authorMocks = require('../../../database/mocks/author-mocks')

const testHelpers = require('../../test-helpers')
const { login, testHttp } = testHelpers

const testUrl = 'http://localhost:3001/api/v1/books'

describe('API ROUTE: /books/ (GET: list) -> ', () => {
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

  describe('Authenticated (invalid token), valid request ->', () => {
    beforeEach(async () => {
      user = await login()
      user.token = testHelpers.invalidToken

      const data = { firstName: 'Best', lastName: 'Author' }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject a request if the token is invalid', async () => {
      expect(response.statusCode).to.equal(401)
      expect(response.error.indexOf('Unauthorized')).to.not.equal(-1)
      expect(response.message.indexOf('Invalid token')).to.not.equal(-1)
    })
  })

  describe('Authenticated, valid request ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = {
        title: 'One Great Book',
        authorId: authorMocks.getOwnedRecordId(user.id)
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should successfully create a new Book when valid data is sent', async () => {
      expect(response).to.be.an.object()
      expect(response.id).to.not.be.undefined()
      expect(response.title).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
      expect(response.author).to.be.an.object()
      expect(response.author.id).to.not.be.undefined()
      expect(response.author.name).to.not.be.undefined()
    })
  })

  describe('Authenticated, valid request (duplicate data) ->', () => {
    let errResponse

    beforeEach(async () => {
      user = await login()

      const data = {
        title: 'One Great Book',
        authorId: authorMocks.getOwnedRecordId(user.id)
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      // submit the CREATE request two times in a row
      let res = await testHttp(request)
      response = res.data
      res = await testHttp(request)
      errResponse = res.data
    })

    afterEach(async () => {
      errResponse = null
    })

    it('should reject creating a new Book when the data matches an existing one', async () => {
      // first response should go through as expected
      expect(response).to.be.an.object()
      expect(response.id).to.not.be.undefined()
      expect(response.title).to.not.be.undefined()
      expect(response.created_at).to.not.be.undefined()
      expect(response.updated_at).to.not.be.undefined()
      expect(response.author).to.be.an.object()
      expect(response.author.id).to.not.be.undefined()
      expect(response.author.name).to.not.be.undefined()
      // second response should be an error
      expect(errResponse.statusCode).to.equal(400)
      expect(errResponse.message).to.not.be.undefined()
      expect(errResponse.message.indexOf('A matching Book already exists')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> extra data ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = {
        title: 'One Great Book',
        authorId: authorMocks.getOwnedRecordId(user.id),
        extraProperty: 'ONOS'
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject creating a new Book when extra data is sent', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('"extraProperty" is not allowed')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> blank title ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = {
        title: '',
        authorId: authorMocks.getOwnedRecordId(user.id)
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject a Book with blank title', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('child "title" fails')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> missing title ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = {
        authorId: authorMocks.getOwnedRecordId(user.id)
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject a Book with missing title', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('child "title" fails')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> missing authorId ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = {
        title: 'One Great Book'
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject a Book with blank authorId', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.validation).to.not.be.undefined()
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('child "authorId" fails')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> unowned authorId ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = {
        title: 'One Great Book',
        authorId: authorMocks.getUnownedRecordId(user.id)
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject a Book with an invalid author ID', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('No matching Author found for foreign key')).to.not.equal(-1)
    })
  })

  describe('Authenticated, bad request -> invalid authorId ->', () => {
    beforeEach(async () => {
      user = await login()

      const data = {
        title: 'One Great Book',
        authorId: 9999999
      }
      const request = apiHelper.axPost(testUrl, data, user.token)
      const res = await testHttp(request)
      response = res.data
    })

    it('should reject a Book with an invalid author ID', async () => {
      expect(response.statusCode).to.equal(400)
      expect(response.message).to.not.be.undefined()
      expect(response.message.indexOf('No matching Author found for foreign key')).to.not.equal(-1)
    })
  })
})
