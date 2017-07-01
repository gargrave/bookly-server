'use strict'

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const env = require('../../../globals/env')
const knex = require('../../../database/db')
const authHelpers = require('../utils/authRouteHelpers')

const emptyProfile = (ownerId) => {
  return {
    owner_id: ownerId,
    first_name: '',
    last_name: ''
  }
}

module.exports = {
  /**
   * Attempts to SELECT and return the User associated with the provided owner ID.
   * If no Profile is found, a Boom error is returned.
   * @param {*} ownerId The ownerId to which this Profile should be linked
   */
  async userSelect (ownerId) {
    let res = Boom.notFound('No matching User found.')

    try {
      const userRecord = await knex(DB.USERS)
        .select(authHelpers.selectCols)
        .where({ 'id': ownerId })
        .limit(1)

      if (userRecord.length) {
        res = userRecord[0]
      }
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('Error @ userDetail.runSelectQuery():')
        console.dir(err)
      }
    }

    return res
  },

  /**
   * Attempts to CREATE a new empty Profile record associated with the provided ownerId
   * @param {*} ownerId The ownerId to which this Profile should be linked
   */
  async profileCreate (ownerId) {
    return knex(DB.PROFILES)
      .insert(emptyProfile(ownerId))
      .returning(authHelpers.profileSelectCols)
  },

  /**
   * Attempts to SELECT and return the Profile associated with the provided owner ID.
   * If no Profile is found, a new one will be created.
   * @param {*} ownerId The ownerId to which this Profile should be linked
   */
  async profileSelect (ownerId) {
    let res = Boom.notFound('No matching Profile found.')

    try {
      let profileRecord = await knex(DB.PROFILES)
        .select(authHelpers.profileSelectCols)
        .where({ owner_id: ownerId })
        .limit(1)

      // if User does not have a Profile for any reason, create an empty one
      if (!profileRecord.length) {
        profileRecord = await this.profileCreate(ownerId)
      }
      // return the first (and only) record as the reply
      res = profileRecord[0]
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('Error @ authQueries.runSelectProfileQuery():')
        console.dir(err)
      }
    }

    return res
  }
}
