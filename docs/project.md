## Missing Files

The following files will need to be recreated for a dev environment, as they are ignored by Git, but required by the app

- `/etc/devEnvVars.js`
  - A JS file to set env. vars for 'dev' environment. Does not need to export anything, but rather just directly set the following vars:
  - `AUTH_SECRET_KEY` - string to use for the "secret key" for signing JWTs. Does not necessarily need to be super-sensitive since this is just for the dev environment, but you can easily generate one using the method shown [here](https://www.npmjs.com/package/hapi-auth-jwt2#generating-your-secret-key).
  - `DATABASE_URL` - The PG connection string to get the database for this environment.
