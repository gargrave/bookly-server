'use strict'

const ApiRoute = require('./basic')

const Boom = require('boom')

const knex = require('../../database/db')
const apiErr = require('../utils/apiErrors')
const helpers = require('../utils/routeHelpers')

class ApiDeleteRoute extends ApiRoute {
  constructor ({ path, auth, db, resourceName }) {
    super({
      method: 'DELETE',
      path: `${path}/{id}`,
      auth,
      db,
      resourceName
    })
  }

  getHandler () {
    return (request, reply) => {
      const ownerId = helpers.getOwnerIdOrDieTrying(request, reply)
      const id = request.params.id

      this.query(id, ownerId).then(res => reply(res))
    }
  }

  /**
   * Runs all necessary queries and returns either error or data.
   *
   * @param {*} id The ID nubmer of the record to delete
   * @param {*} ownerId The owner ID of the user making the request
   */
  async query (id, ownerId) {
    let sel = await this.runSelectQuery({ id, owner_id: ownerId })
    let del = await this.runDeleteQuery({ id, owner_id: ownerId })
    // if we get nothing back from del(), everything went okay
    return del !== undefined ? del : sel
  }

  /**
   * Runs a SELECT query before the resource is deleted. This way we can
   * have the original data to return AFTER it has been deleted.
   *
   * @param {Object} where The data to use for the WHERE clause
   */
  async runSelectQuery (where) {
    let val = Boom.notFound(apiErr.notFound(this.resourceName, where.id))

    await knex(this.db)
      .select(this.getSelectParams())
      .where(where)
      .limit(1)
      .then(res => {
        if (res.length) {
          val = res[0]
        }
      })

    return val
  }

  /**
   * Runs the DELETE query on the database.
   *
   * If any errors are encountered, it will return an appropriate error message;
   *    otherwise it will simply return undefined.
   *
   * @param {Object} where The data to use for the WHERE clause
   */
  async runDeleteQuery (where) {
    let val

    await knex(this.db)
      .where(where)
      .del()
      .then(() => {
        // if the query is successful, we don't need to do anything here
      }, err => {
        // if we get an error, use that for the return value
        console.error(err)
        val = Boom.badRequest(apiErr.failedToDelete(this.resourceName))
      })

    return val
  }
}

module.exports = ApiDeleteRoute
