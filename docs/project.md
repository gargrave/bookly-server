## Missing Files

The following files will need to be recreated for a dev environment, as they are ignored by Git, but required by the app

- `/etc/authSecretKey.txt`
  - A text file that contains the text to use for the "secret key" for signing JWTs. Does not necessarily need to be super-sensitive since this is just for the dev environment, but you can easily generate one using the method shown [here](https://www.npmjs.com/package/hapi-auth-jwt2#generating-your-secret-key).
