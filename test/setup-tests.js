'use strict'

const Lab = require('lab')
const lab = exports.lab = Lab.script()

const server = require('../index')

const envVars = require('../etc/envVars-test')
const log = require('../globals/logger').verboseLog

log('Setting up test environment...')

global.server = server
global.before = lab.before
global.beforeEach = lab.beforeEach
global.describe = lab.describe
global.expect = lab.expect
global.experiment = lab.experiment
global.it = lab.it

describe('Environment setup:', () => {
  it('should have global testing variables set up', (done) => {
    expect(server).to.not.be.undefined()
    expect(before).to.not.be.undefined()
    expect(beforeEach).to.not.be.undefined()
    expect(describe).to.not.be.undefined()
    expect(expect).to.not.be.undefined()
    expect(experiment).to.not.be.undefined()
    expect(it).to.not.be.undefined()
    done()
  })

  it('should have a valid database URL', (done) => {
    expect(process.env.DATABASE_URL).to.not.be.undefined()
    expect(process.env.DATABASE_URL).to.equal(envVars.DATABASE_URL)
    done()
  })
})

describe('Server setup:', () => {
  it('starts up and listens as expected', (done) => {
    expect(server.info.host).to.not.be.undefined()
    done()
  })
})
