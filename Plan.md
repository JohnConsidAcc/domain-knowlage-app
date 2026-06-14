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
- ✅ AWS CloudFormation deployment.
  - cloudformation/template.yml — single EC2 instance (Ubuntu 22.04 LTS via SSM AMI,
    t3.small default, 30 GB gp3 root), Security Group (22/80/443/3000/8080), Elastic IP,
    IAM role with CloudWatchAgentServerPolicy; UserData installs Docker, clones the repo,
    writes .env.prod from parameters, and starts all services.
  - cloudformation/parameters.example.json — placeholder values for all 12 parameters.
  - cloudformation/deploy.sh — wrapper around aws cloudformation deploy, defaults to
    eu-north-1, prints stack outputs (AppUrl, KeycloakUrl, SshCommand) on completion.
  - .gitignore updated to exclude cloudformation/parameters.json.

---

## Pending

Nothing pending.
