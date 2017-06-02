console.log('*****')
console.log('using dev configuration')
console.log('*****')

module.exports = {
  database: {
    client: 'pg',
    connection: {
      host: 'localhost',
      database: 'bookly_dev',
      user: '',
      password: ''
    }
  }
}
