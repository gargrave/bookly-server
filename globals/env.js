const printFullErrors = (process.env.SHOW_FULL_ERRORS_IN_DEV === 'true')

module.exports = {
  isProdEnv: () => process.env.NODE_ENV === 'prod',
  isStagingEnv: () => process.env.NODE_ENV === 'staging',
  isDevEnv: () => process.env.NODE_ENV === 'dev',

  error (err, location) {
    if (this.isDevEnv()) {
      console.log(`Error @ ${location}`)
      if (printFullErrors) {
        console.error(err)
      }
    }
  }
}
