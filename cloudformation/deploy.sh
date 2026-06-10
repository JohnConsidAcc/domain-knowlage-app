#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# deploy.sh — deploy or update the Domain Knowledge App CloudFormation stack
#
# Prerequisites:
#   - AWS CLI v2 installed and configured (aws configure / IAM role / env vars)
#   - cloudformation/parameters.json exists (copy from parameters.example.json
#     and fill in real values — it is gitignored so secrets stay local)
#   - Caller must have: ec2:*, iam:PassRole, cloudformation:*
#
# Usage:
#   bash cloudformation/deploy.sh [stack-name]
#
#   stack-name defaults to "domain-knowledge-app".
#   Region is read from AWS_DEFAULT_REGION (defaults to eu-north-1).
#
# First-time workflow:
#   1. Run this script. The stack will be created and an Elastic IP allocated.
#   2. Read the Elastic IP from the Outputs printed at the end.
#   3. Update AppUrl and KeycloakUrl in parameters.json to use that IP.
#   4. Run this script again — the stack will update in-place (the EIP stays).
#   5. SSH in and wait for UserData to finish: tail -f /var/log/user-data.log
#
# To pull new code after deployment (UserData only runs on first boot):
#   ssh ubuntu@<ELASTIC_IP>
#   cd /app && git pull
#   docker compose --env-file .env.prod up -d --build
# ---------------------------------------------------------------------------
set -euo pipefail

STACK_NAME="${1:-domain-knowledge-app}"
REGION="${AWS_DEFAULT_REGION:-eu-north-1}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARAMETERS_FILE="$SCRIPT_DIR/parameters.json"
TEMPLATE_FILE="$SCRIPT_DIR/template.yml"

if [[ ! -f "$PARAMETERS_FILE" ]]; then
  echo "ERROR: $PARAMETERS_FILE not found."
  echo "  Copy cloudformation/parameters.example.json to cloudformation/parameters.json"
  echo "  and fill in the real values before deploying."
  exit 1
fi

echo "=== Deploying stack: $STACK_NAME  (region: $REGION) ==="

aws cloudformation deploy \
  --template-file "$TEMPLATE_FILE" \
  --stack-name "$STACK_NAME" \
  --parameter-overrides "file://$PARAMETERS_FILE" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$REGION"

echo ""
echo "=== Stack outputs ==="
aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" \
  --region "$REGION" \
  --query "Stacks[0].Outputs" \
  --output table
