# Bookly (server)

First off, yes, this is an "authors and books" CRUD app, so don't expect it to rock your world too much. I wanted to work with a few new technologies and methodologies, so I decided to keep the project... well, pointless... in nature. Once I have a good workflow with all of these tools, I do plan to put them to use on a much bigger project (don't we all, though?). 


The simplified version of my goals for this project:

- Familiarize myself with the [HapiJS](https://github.com/hapijs/hapi) ecosystem, and build a nice, complete RESTful API with it
- Finally get around to learning [Docker](https://www.docker.com/) (I did learn Docker, but decided I was not feeling it for this project, so I scrapped it.)
- Deploy it all on my own Nginx server at Digital Ocean

---

## Demo and Front End Code

You can play with the current build of the app [here](https://www.bookly-app.us). Bear in mind it's a work in progress, but at this point it is a mostly-functional if not very exciting app. It will continue to be updated as I make progress.

The codebase for the front end you are using in this demo is available [here](https://github.com/gargrave/bookly-client).

---

## Q&D Overview

Just a few highlights:

- RESTful API built with HapiJS
- Database management (PostgreSQL) with [Knex](https://github.com/tgriesser/knex)
- Validation with [Joi](https://github.com/hapijs/joi)
- Error-handling with [Boom](https://github.com/hapijs/boom)
- Authentication via JWT
- Testing with [Lab](https://github.com/hapijs/lab)

---

## Using It

Since I scrapped Docker for this project, the process is fairly straightforward for a Node app. Do a `git clone` and `npm install` to get everything ready.

Be default, the app expects a PostgreSQL database to be setup already, with the environmental vars defined as outlined [here](docs/project.md). Once you have the database setup and the path defined, you can run the migrations with `npm run db:dev:migrate` (or `npm run db:prod:migrate` for production environment). You can also seed the DB with some basic data with `npm run db:dev:seed` (only in 'test' and 'dev' environments).

### Testing

You can run the tests with `npm test`. Note that the tests expect a separate test DB to already be created and defined as outlined [here](docs/project.md), but they will be migrated and seeded at the beginning of every test run, so as long as you have the DB created and the path defined correctly, you shouldn't to worry about anything else.
