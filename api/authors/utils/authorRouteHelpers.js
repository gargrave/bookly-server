const DB = require('../../../globals/constants').db

module.exports = {
  params: {
    path: 'authors',
    db: DB.AUTHORS,
    resourceName: 'Author'
  },

  selectCols: ['id', 'firstName', 'lastName', 'created_at', 'updated_at']
}
