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
   */
  async userSelect ({ id, email, includePassword }) {
    let res = Boom.notFound('No matching User found.')

    // build the SELECT clause based on whether the password hash should be included
    let select = authHelpers.selectCols
    if (includePassword === true) {
      select.push('password')
    }

    // build the WHERE clause based on received args
    let where = {}
    if (id) {
      where.id = id
    }
    if (email) {
      where.email = email
    }

    try {
      const userRecord = await knex(DB.USERS)
        .select(select)
        .where(where)
        .limit(1)
      // if we have a record, use that for the return value
      if (userRecord.length) {
        res = userRecord[0]
      }
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('Error @ userDetail.runSelectQuery():')
        console.error(err)
      }
    }

    return res
  },

  /**
   * Updates the current user record like so:
   *  The value of previous_login is copied to last_login
   *  The value of previous_login is set to now
   *
   * @param {*} user The data for the User who has successfully logged in.
   */
  async userUpdate (user) {
    const where = { id: user.id, email: user.email }
    const updatedLastLogin = user.previous_login

    try {
      await knex(DB.USERS)
        .where(where)
        .update({
          last_login: updatedLastLogin,
          previous_login: knex.raw('NOW()')
        })
      // update the data we are sending back to client with the correct "last login" value
      user.last_login = updatedLastLogin
    } catch (err) {
      if (env.isDevEnv()) {
        console.log('err:')
        console.error(err)
      }
    }
    // return the UPDATED version of the user data
    return user
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
        console.error(err)
      }
    }

    return res
  }
}
