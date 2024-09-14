#!/bin/sh
#Exit when error happens
set -e

# For debuging
ls -la

# Secrets
echo "$CLOUDFLARE_ORIGIN_CERTIFICATE" > /etc/ssl/easyflow.pem
echo "$CLOUDFLARE_ORIGIN_CA_KEY" > /etc/ssl/easyflow.key

#Start application
NODE_ENV=production bunx next start &

#Start nginx in the forground
nginx -g 'daemon off;'