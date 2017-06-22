# Bookly (server)

First off, yes, this is an "authors and books" CRUD app, so don't expect it to rock your world too much. I wanted to work with a few new technologies and methodologies, so I decided to keep the project... well, pointless... in nature. Once I have a good workflow with all of these tools, I do plan to put them to use on a much bigger project (don't we all, though?). 

Also, it's really important to note: this is definitely not production ready at this point, so if you get possessed by a demon and decide to try to work with anything here locally, be sure you're not doing anything super-sensitive with it.

The simplified version of my goals for this project:

- Familiarize myself with the [HapiJS](https://github.com/hapijs/hapi) ecosystem, and build a nice, complete RESTful API with it
- Finally get around to learning [Docker](https://www.docker.com/)
- Deploy it all on my own Nginx server at Digital Ocean

---

## Q&D Overview

Just a few highlights:

- RESTful API built with HapiJS
- Database management (PostgreSQL) with [Knex](https://github.com/tgriesser/knex)
- Validation with [Joi](https://github.com/hapijs/joi)
- Error-handling with [Boom](https://github.com/hapijs/boom)
- Authentication via JWT

---

## Short-term Improvement Goals

- Registration emails, including "confirm your account" email, "pasword reset" email, and those kinds of things. The registration system is working right now, but it's pretty minimal. This is definitely my next major addition.
- Better error-handling. Errors are handled, and there shouldn't be any crashes, but they are not very user-friendly at this point. This is actually more of an issue for the front end, but it require some tweaking here as well.

---

## Using It

While it is currently designed with my own needs in mind, you _should_ be able to get it running fairly easily if you want to. The intent is for it to be run next to an Nginx server in production, but in development, have the Node Docker container directly expose its port.

So, locally for development, you can just connect to `localhost:3001`, while in production, you would connect to Nginx and let it connect to Node/Docker. Only Node and PostgreSQL are running in Docker--I left Nginx out of the Docker mix to make it easier to configure.

No matter which environment you are running in, you will always need to recreate the config files to set up env. vars, as described [here](./docs/project.md).

Then use the `docker-dev` NPM command to boot up everything for development, or `docker-prod` for production. 

Note that you will need to run **database migrations** after the initial build, so once you have the Docker containers running, do:

```sh
docker ps # get the ID of the Node Docker container
docker exec -it [id_from_above] bash # run Bash in said container

# in container's shell:
npm run db:dev:migrate && npm run db:dev:seed
# or, for production
npm run db:prod:migrate
```

As far as updating it, I have just been doing Git pulls on my server, and then manually pushing the updated files into the container. So a simple script like this can handle it:

```sh
# move into main dir, and pull updated source
cd /var/www/[project_root]
git pull
# copy source files over to Docker container
docker cp ./ [container_name]:/usr/app/
# restart the container
docker restart [container_name]
```
