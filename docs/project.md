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

A sample file might look like this. You don't really have to create an object and loop through it like this. I just find it a little cleaner to not have `process.env` written out for every var.

```js
const jwtDuration = 60 * 60

const envVars = {
  // required
  AUTH_SECRET_KEY: 'ineedabettersecretkey',
  DATABASE_URL: 'postgres://db_user:db_password@postgres/db_name',

  // optional
  CORS_WHITELIST: 'http://localhost:8080,https://mygreatwebsite.net',
  JWT_DEFAULT_DURATION: jwtDuration,

  // mailgun config
  MAILGUN_API_URL: '<mg-api-url>.mailgun.org',
  MAILGUN_API_KEY: 'key-<whatever-your-api-key-might-be>'
}

for (let v in envVars) {
  process.env[v] = envVars[v]
}
```

---

### docker-compose.secrets.yml

An extension docker-compose file to pass in "secret" values. This will be appended after the main compose file and the environment-specific one have been loaded.

What it currently needs:

- postgres -> environment:
  - `POSTGRES_USER`, `POSTGRES_DB`, and `POSTGRES_PASSWORD`
    - Technically, you don't _really_ need these if you do not wish to have the extra security, but they are strongly recommended.
    - The values can be whatever you want--the PG Docker image will use them to build the database and/or user when you first build the container.
    - Note that the value of `process.env.DATABASE_URL` in `envVars.js` needs to correspond to these, and I do not have any clever mechanism for automatically injecting them there, so be sure you update that file with these values. So, for example, assuming the configuration below, the full database URL would be: `postgres://my_pg_username:my_pg_password@postgres/super_secure_password`

A sample file might look like this:

```yaml
version: '2'
services:
  postgres:
    environment:
      POSTGRES_USER: my_pg_username
      POSTGRES_DB: my_pg_password
      POSTGRES_PASSWORD: super_secure_password
```
