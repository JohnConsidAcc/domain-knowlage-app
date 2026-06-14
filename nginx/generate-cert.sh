#!/usr/bin/env bash
# Generate a self-signed TLS certificate for the Nginx reverse proxy.
#
# Usage:
#   bash nginx/generate-cert.sh <server-ip>
#   bash nginx/generate-cert.sh 1.2.3.4
#
# The server IP is embedded as a Subject Alternative Name so browsers
# accept the certificate for a bare IP address.
#
# Output: nginx/ssl/cert.pem and nginx/ssl/key.pem (gitignored).
# Run this BEFORE building the Docker image:
#   docker compose --env-file .env.prod up -d --build
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SSL_DIR="$SCRIPT_DIR/ssl"

SERVER_IP="${1:-${SERVER_IP:-}}"

mkdir -p "$SSL_DIR"

if [ -n "$SERVER_IP" ]; then
    SAN="subjectAltName=IP:${SERVER_IP},DNS:localhost"
    echo "Generating certificate with SAN for IP: $SERVER_IP"
else
    SAN="subjectAltName=DNS:localhost"
    echo "WARNING: No server IP provided — generating certificate for localhost only."
    echo "         Browsers will reject this for a remote IP address."
    echo "         Usage: bash nginx/generate-cert.sh <server-ip>"
fi

# MSYS_NO_PATHCONV=1 prevents Git Bash on Windows from converting the
# -subj value (which starts with /) into a Windows filesystem path.
MSYS_NO_PATHCONV=1 openssl req -x509 \
    -newkey rsa:4096 \
    -keyout "$SSL_DIR/key.pem" \
    -out    "$SSL_DIR/cert.pem" \
    -days 3650 \
    -nodes \
    -subj "/CN=domain-knowledge-app" \
    -addext "$SAN"

echo ""
echo "Certificate written to nginx/ssl/ (gitignored — never commit these files)."
echo "Now run: docker compose --env-file .env.prod up -d --build"
