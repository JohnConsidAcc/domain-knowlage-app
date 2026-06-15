#!/bin/sh
# Keycloak does not substitute ${env.VAR} in realm JSON at import time.
# This entrypoint preprocesses the realm template with actual env var values
# before kc.sh starts, so the secret stored in Keycloak matches OIDC_CLIENT_SECRET.
set -e

TEMPLATE=/opt/keycloak/data/realm-template.json
IMPORT_DIR=/opt/keycloak/data/import

if [ -f "$TEMPLATE" ]; then
  mkdir -p "$IMPORT_DIR"
  sed 's|\${env\.KC_CLIENT_SECRET}|'"${KC_CLIENT_SECRET}"'|g' \
    "$TEMPLATE" > "$IMPORT_DIR/realm.json"
fi

exec /opt/keycloak/bin/kc.sh "$@"
