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

### AWS CloudFormation deployment

I should be able to provision the entire production environment on AWS using a
single CloudFormation template — no manual console clicking required.

#### Deliverables

1. **`cloudformation/template.yml`** — CloudFormation template that creates:
   - EC2 instance (Ubuntu 22.04 LTS, `t3.small` default, configurable via parameter).
   - Security Group with ingress on port 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000 (Nuxt) and 8080 (Keycloak). 22 should be restricted to a trusted CIDR parameter.
   - Elastic IP so the public address stays stable across stop/start.
   - IAM instance profile with CloudWatch Logs permissions (so docker logs can be shipped).
   - User Data script that:
     - Installs Docker Engine and Docker Compose v2 on first boot.
     - Clones the repository (or pulls a specified branch).
     - Writes `.env.prod` from CloudFormation parameters.
     - Runs `docker compose --env-file .env.prod up -d --build`.

2. **`cloudformation/parameters.example.json`** — example parameters file showing every
   parameter name and a placeholder value, committed to git.

3. **`cloudformation/deploy.sh`** — thin wrapper around `aws cloudformation deploy`
   that reads a local `cloudformation/parameters.json` (gitignored) and deploys
   or updates the stack.

4. **`.gitignore`** — add `cloudformation/parameters.json` (contains real secrets).

#### CloudFormation parameters

| Parameter | Description |
|---|---|
| `InstanceType` | EC2 instance type (default: `t3.small`) |
| `KeyPairName` | Existing EC2 key pair for SSH access |
| `SshCidr` | CIDR range allowed to SSH (e.g. your office IP) |
| `GitRepo` | Repository URL to clone on the instance |
| `GitBranch` | Branch to check out (default: `main`) |
| `AppUrl` | Public URL of the app, e.g. `http://<elastic-ip>:3000` |
| `KeycloakUrl` | Public URL of Keycloak, e.g. `http://<elastic-ip>:8080` |
| `KeycloakAdminPassword` | Admin password for the Keycloak console |
| `DbPassword` | Password for the app Postgres database |
| `KcDbPassword` | Password for the Keycloak Postgres database |
| `NextAuthSecret` | Random secret for NextAuth (generate: `openssl rand -base64 32`) |
| `OidcClientSecret` | OIDC client secret shared between Keycloak and the app |

#### CloudFormation outputs

| Output | Value |
|---|---|
| `AppUrl` | `http://<ElasticIP>:3000` |
| `KeycloakUrl` | `http://<ElasticIP>:8080` |
| `SshCommand` | `ssh ubuntu@<ElasticIP>` |

#### Constraints and notes

- Secrets are passed as CloudFormation `NoEcho` parameters so they are not
  visible in the console events or outputs.
- The Elastic IP is allocated and associated with the instance; the same IP
  survives a stack update that replaces the instance.
- The User Data script should be idempotent — re-running it (e.g. after an
  instance reboot) must not break the running containers.
- The deploy script must work with the AWS CLI v2 and assume the caller has
  appropriate IAM permissions (`ec2:*`, `cloudformation:*`, `iam:PassRole`).
- The stack name is configurable in `deploy.sh` (default: `domain-knowledge-app`).
