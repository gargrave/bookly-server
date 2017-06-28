module.exports = {
  // error listing existing records
  failedToList (modelName) {
    return `${modelName} listing failed.`
  },

  // error creating a new record
  failedToCreate (modelName) {
    return `${modelName} creation failed.`
  },

  // error updating an existing record
  failedToUpdate (modelName) {
    return `${modelName} update failed.`
  },

  // error deleting an existing record
  failedToDelete (modelName) {
    return `${modelName} delete failed.`
  },

  // attempting to create a duplicate entry
  matchingRecord (modelName) {
    return `A matching ${modelName} already exists.`
  },

  // no record with matching ID in database
  notFound (modelName, id) {
    return `No ${modelName} with id '${id}' could be found.`
  },

  // invalid login attempt
  invalidLogin () {
    return 'Could not log in with the provided credentials.'
  },

  userExists () {
    return 'Email is already in use by another user.'
  }
}
