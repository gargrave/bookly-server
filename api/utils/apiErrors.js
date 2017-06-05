module.exports = {
  // error creating a new record
  failedToCreate (modelName) {
    return `${modelName} creation failed.`
  },

  // error updating an existing record
  failedToUpdate (modelName) {
    return `${modelName} update failed.`
  },

  // no record with matching ID in database
  notFound (modelName, id) {
    return `No ${modelName} with id ${id} could be found.`
  }
}
