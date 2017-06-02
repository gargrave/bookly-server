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

  logging: {
    console: {
      prettyPrint: true,
      colorize: true,
      silent: false,
      timestamp: true
    }
  }
}
