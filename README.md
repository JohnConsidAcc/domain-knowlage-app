# Domain knowlage app

This project is a quiz tool.

## Utvecklat med

Claude Code (agentdriven utveckling) as part of the course Next-Generation Software Development with AI.

## What it does

This quiz tool is intended to be run on-prem in IT-projects or the like. The core idea is to have AI generate questions based on the code, confluence or other documents, as well as the AI's inherent knownlage in the respective domain.

- Project members can then use the tool in a leisurely manner to retain knowlage or get back up to speed after vacation.

### Technology stack

- Docker (Docker compose)
- Nodejs
- Vue
- Postgres
- Prisma
- Keycloak
- Nginx
- Vitest
- Playwright

## Getting started with development

### Basic architecture

```
/app # frontend
/server # backend for frontend
/prisma # data models and migrations- code first
/tests # unit tests for server and playwright tests for backend
```

See the `docker-compose.yml` for the composition of services.

### Run for development

Start the backend containers

> npm run docker:up

Install javascript dependencies

> npm install

Setup the tables in the database

> npm run db:migrate

Seed the database with example questions

> npm run db:seed

Run the dev server in the terminal

> npm run dev

Go to localhost:3000

## Run in production

### Requirements - Production

- Node
- Docker (Docker compose)

### Configuration

See instructions in `.env.prod.example`

### Running the project

> npm run docker:prod:up

To seed the database with example questions

> docker exec dka-prod-app-1 npx prisma db seed

## License

[GNU Affero General Public License v3.0](https://github.com/fauh/xenopairings/blob/master/LICENSE) — free to use, modify, and distribute, but any modified version deployed as a network service must also be open source under the same license.
