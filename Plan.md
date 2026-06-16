# Plan.md

Please follow the rules and guidelines in Claude.md.

## Completed

- ✅ The name of the current user is displayed in the upper right corner.
- ✅ Users can sign up as new accounts (open registration via Keycloak).
- ✅ Production deployment on AWS EC2 with Docker Compose.
  - Multi-stage Dockerfile, docker-entrypoint.sh (auto-runs prisma migrate deploy).
  - docker-compose.yml with app, db, keycloak-db and keycloak services.
  - Keycloak runs in production mode (start) backed by its own Postgres database.
  - keycloak/realm.prod.json — no test user, open registration, dynamic redirect URIs.
  - .env.prod.example documents all required secrets; .env.prod is gitignored.
  - npm scripts: docker:up, docker:prod:up, docker:down, docker:reset, docker:logs.
---

## Pending

Nothing pending.
