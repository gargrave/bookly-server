module.exports = {
  server: {
    port: process.env.port || 3001,
    routes: {
      cors: {
        origin: ['*']
      }
    }
  },

  node: {
    debugPort: 5858
  },

  database: {
    connection: {
      database: 'my-database-name'
    }
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
