FROM nginx:alpine

# nginx/ssl/ must exist before building.
# Run: bash nginx/generate-cert.sh <server-ip>
COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/key.pem  /etc/nginx/ssl/key.pem

COPY nginx.conf /etc/nginx/nginx.conf
