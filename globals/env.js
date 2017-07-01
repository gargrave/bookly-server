module.exports = {
  isProdEnv: () => process.env.NODE_ENV === 'prod',
  isStagingEnv: () => process.env.NODE_ENV === 'staging',
  isDevEnv: () => process.env.NODE_ENV === 'dev'
}
