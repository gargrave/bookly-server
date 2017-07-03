const knex = require('../../../database/db')
const DB = require('../../../globals/constants').db
const utils = require('../../utils/utils')
const helpers = require('../email-helpers')

async function findExistingToken (where) {
  let val

  await knex(DB.TOKENS_VERIFY)
    .select()
    .where(where)
    .limit(1)
    .then(res => {
      if (res.length) {
        val = res[0]
      }
    })

  return val
}

async function createToken (config) {
  const token = utils.getRandomToken(36)
  let val

  await knex(DB.TOKENS_VERIFY)
    .insert({ token, email: config.to })
    .returning(['id', 'email', 'token'])
    .then(res => { val = res[0] })

  return val
}

module.exports = {
  async send (mg, config) {
    // get the necessary token, by either finding an existing one or creating a new one
    let tokenRecord = await findExistingToken({ email: config.to })
    if (!tokenRecord) {
      tokenRecord = await createToken(config)
    }
    config.token = tokenRecord.token

    // send the email!
    const template = require('../templates/verify')
    mg.messages().send(helpers.buildEmail(config, template), (err, body) => {
      helpers.showResults('verify', err, body)
    })
  },

  async dump (config) {
    let tokenRecord = await findExistingToken({ email: config.to })
    if (!tokenRecord) {
      tokenRecord = await createToken(config)
    }
    config.token = tokenRecord.token

    const template = require('../templates/verify')
    console.log(template.html(config))
  }
}
