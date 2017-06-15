'use strict'

const ApiDeleteRoute = require('../../generic-routes/delete')

const Boom = require('boom')

const DB = require('../../../globals/constants').db
const apiErr = require('../../utils/apiErrors')
const knex = require('../../../database/db')
const helpers = require('../utils/bookRouteHelpers')

class BookDeleteRoute extends ApiDeleteRoute {
  constructor () {
    super(helpers.params)
  }

  /**
   * Override to populate the 'author' prop in a more readable way.
   */
  async runSelectQuery (where) {
    let { id, ownerId } = where
    let val = Boom.notFound(apiErr.notFound(this.resourceName, id))

    await knex(this.db)
      .select(this.getSelectParams())
      .innerJoin(DB.AUTHORS, `${DB.BOOKS}.authorId`, `${DB.AUTHORS}.id`)
      .where({
        [`${DB.BOOKS}.ownerId`]: ownerId,
        [`${DB.BOOKS}.id`]: id
      })
      .limit(1)
      .then(res => {
        if (res.length) {
          val = helpers.populateAuthor(res[0])
        }
      })

    return val
  }

  getSelectParams () {
    return helpers.selectCols
  }
}

module.exports = new BookDeleteRoute().buildRoute()
