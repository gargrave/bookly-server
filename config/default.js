require('../etc/envVars')

module.exports = {
  server: {
    port: process.env.port || 3001,
    router: {
      stripTrailingSlash: true
    }
  },

  database: {
    client: 'pg',
    connection: process.env.DATABASE_URL
  },

  node: {
    debugPort: 5858
  },

  logging: {
    console: {
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    }
  }
}
