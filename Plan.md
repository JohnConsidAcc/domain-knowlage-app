# Plan.md

Please follow the rules and guidelines in Claude.md.

- The name of the current user should be displayed in the upper right corner.
- I should be able to sign up as a new user.
- I should be able to launch a production version of the project on an AWS EC2 instance running Docker.
  - Target: a single EC2 instance (Ubuntu 22.04 LTS, t3.small or larger) with Docker and Docker Compose v2 installed.
  - All services (Nuxt app, Postgres, Keycloak) run as containers defined in docker-compose.yml.
  - The Nuxt app is built into a Docker image using a multi-stage Dockerfile (Node build stage → lean Node runtime stage).
  - Keycloak must run in production mode (`start` command, not `start-dev`) backed by its own Postgres database so realm data persists across restarts.
  - A separate production Keycloak realm config (no test user, registration open) is used; redirect URIs point to the EC2 public IP or domain.
  - Prisma migrations (`prisma migrate deploy`) run automatically on app container startup before the server starts.
  - All production secrets and URLs are specified in a `.env.prod` file (gitignored; a `.env.prod.example` is committed instead). This file is used with `docker compose --env-file .env.prod up -d`.
  - Internal service communication uses Docker Compose service names (e.g. `DATABASE_URL` uses `db:5432`, Keycloak uses its container name) — not `localhost`.
  - The production deployment must not contain the test user (`test@example.com`) or the E2E seed questions.
  - The `POST /api/test/reset` endpoint is already blocked in production via the `NODE_ENV` guard.
  - EC2 security group: open port 3000 (Nuxt) and 8080 (Keycloak) to the world, or preferably route both through a reverse proxy on port 80/443.
