#!/bin/sh
# Generate a self-signed TLS certificate on first run, then start Nginx.
# The cert is stored in a named Docker volume so it persists across restarts.
#
# Set SERVER_IP in the environment to include the server's public IP as a
# Subject Alternative Name — required for browsers to accept the cert for an IP.
set -e

SSL_DIR=/etc/nginx/ssl
mkdir -p "$SSL_DIR"

if [ ! -f "$SSL_DIR/cert.pem" ]; then
    echo "=== Generating self-signed TLS certificate ==="

    if [ -n "${SERVER_IP:-}" ]; then
        SAN="subjectAltName=IP:${SERVER_IP},DNS:localhost"
    else
        SAN="subjectAltName=DNS:localhost"
    fi

    openssl req -x509 \
        -newkey rsa:4096 \
        -keyout "$SSL_DIR/key.pem" \
        -out  "$SSL_DIR/cert.pem" \
        -days 3650 \
        -nodes \
        -subj "/CN=domain-knowledge-app" \
        -addext "$SAN"

    echo "=== Certificate generated (valid 10 years) ==="
fi

exec nginx -g "daemon off;"
