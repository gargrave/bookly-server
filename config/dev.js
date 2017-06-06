console.log('*****')
console.log('using dev configuration')
console.log('*****')

// run dev script to set up env. vars for dev environment
require('../scripts/env/dev')

module.exports = {
  database: require('../etc/devDatabase')
}
