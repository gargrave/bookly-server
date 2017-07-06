'use strict'

const helpers = require('../../../api/utils/route-helpers')

function buildRequest (ownerIdValue) {
  return { auth: { credentials: { id: ownerIdValue || 'bad owner ID' } } }
}

describe('getOwnerIdOrDieTrying()', () => {
  let reply
  let error

  beforeEach((done) => {
    reply = function (value) {
      error = value
    }
    done()
  })

  it('should return the owner ID if passed a correct value', (done) => {
    const ownerId = 123
    const result = helpers.getOwnerIdOrDieTrying(buildRequest(ownerId), reply)
    expect(error).to.be.undefined()
    expect(result).to.equal(ownerId)
    done()
  })

  it('returns a Boom error if no valid owner ID can be found', (done) => {
    helpers.getOwnerIdOrDieTrying(buildRequest(), reply)
    expect(error).to.not.be.undefined()
    expect(error.message).to.equal('Unauthorized')
    done()
  })
})
