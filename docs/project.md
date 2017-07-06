# Required Config Files

The following files will need to be recreated before the app can be run, as they set necessary environment variables. These will be included when you run either the `docker-dev` or `docker-prod` commands in NPM.

These should all be included within an `etc` folder in the project's root (this directory is ignored by Git).

---

### envVars.js

Environment variables for Node. Needs to include the following:

#### Required Keys

- `AUTH_SECRET_KEY` - string to use for the "secret key" for signing JWTs. You can easily generate one with Node using the method shown [here](https://www.npmjs.com/package/hapi-auth-jwt2#generating-your-secret-key).
- `DATABASE_URL` - The PG connection string to get to the database.

#### Optional Keys

- `CORS_WHITELIST` - A comma-separated string of fully-qualified URLs that should be allowed through CORS restrictions. This can be ommitted if preferred, in which case CORS will remain disabled for all routes.
- `JWT_DEFAULT_DURATION` - The default time after which a JWT will expire. Should be expressed in seconds (i.e. a value of `60 * 60` will give you a JWT that expires 1 hour after being issued). If you do not specify anything here, the default value of 1 hour will be used.
- `DUMP_DEV_EMAILS_TO_CONSOLE` - When set to true, any emails that would normally be sent will instead simply be dumped to the console. For 'dev' env. only.
- `SHOW_FULL_ERRORS_IN_DEV` - When set to true, error messages will be dumped in full to the console in 'dev' env. Set this false to avoid dumping errors, as they can sometimes get pretty verbose.

#### Mailgun config (required if you want to send emails)

If you wish to send real emails, you will need to define these:

- `CLIENT_BASE_URL` - The base URL for your app. This is used to generate URLs for your emails like the "password reset" link, since they need to know where to redirect.
- `MAILGUN_API_URL` - The base URL for your Mailgun account
- `MAILGUN_API_KEY` - The API key for your Mailgun account

A sample file might look like this:

```js
// etc/envVars.js
const jwtDuration = 60 * 60

const dbUser = 'db_user'
const dbPassword = 'db_password'
const dbPath = 'localhost/db_name'

const vars = {
  // required
  AUTH_SECRET_KEY: 'ineedabettersecretkey',
  DATABASE_URL: `postgres://${dbUser}:${dbPassword}@${dbPath}`,

  // mailgun config
  CLIENT_BASE_URL: 'https://mygreatwebsite.net/#',
  MAILGUN_API_URL: '<mg-api-url>.mailgun.org',
  MAILGUN_API_KEY: 'key-<whatever-your-api-key-might-be>',

  // optional
  CORS_WHITELIST: 'http://localhost:8080,https://mygreatwebsite.net',
  JWT_DEFAULT_DURATION: jwtDuration,
  DUMP_DEV_EMAILS_TO_CONSOLE: true,
  SHOW_FULL_ERRORS_IN_DEV: true
}

for (let v in vars) {
  process.env[v] = vars[v]
}

module.exports = vars
```

---

### envVars-test.js

Just a simple override file for 'test' env (note that this one exports its vars). Basically just define the path to the test DB so that the tests do not use your dev or prod DB.

```js
const dbUser = 'bookly_test_user'
const dbPassword = 'testuserpassword'
const dbPath = 'localhost/bookly_test_db'

const vars = {
  DATABASE_URL: `postgres://${dbUser}:${dbPassword}@${dbPath}`
}

for (let v in vars) {
  process.env[v] = vars[v]
}

module.exports = vars
```
