require('../etc/envVars-test')

module.exports = {
  database: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  }
}
