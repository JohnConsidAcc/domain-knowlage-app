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

# On Windows/Git Bash, openssl is a native Windows binary that cannot open
# MSYS POSIX paths (/c/Users/...). cygpath -m converts them to mixed Windows
# paths (C:/Users/...) that Windows binaries understand.
# On Linux/macOS cygpath is absent so the paths are used as-is.
if command -v cygpath &>/dev/null; then
    KEYOUT="$(cygpath -m "$SSL_DIR/key.pem")"
    CERTOUT="$(cygpath -m "$SSL_DIR/cert.pem")"
else
    KEYOUT="$SSL_DIR/key.pem"
    CERTOUT="$SSL_DIR/cert.pem"
fi

# MSYS_NO_PATHCONV=1 prevents Git Bash from converting -subj "/CN=..."
# into a Windows filesystem path (C:/Program Files/Git/CN=...).
# The output paths are already in Windows format via cygpath above.
MSYS_NO_PATHCONV=1 openssl req -x509 \
    -newkey rsa:4096 \
    -keyout "$KEYOUT" \
    -out    "$CERTOUT" \
    -days 3650 \
    -nodes \
    -subj "/CN=domain-knowledge-app" \
    -addext "$SAN"

echo ""
echo "Certificate written to nginx/ssl/ (gitignored — never commit these files)."
echo "Now run: docker compose --env-file .env.prod up -d --build"
