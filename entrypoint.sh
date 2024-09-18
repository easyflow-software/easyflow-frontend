#!/bin/sh
#Exit when error happens
set -e

# Secrets
echo "$CLOUDFLARE_ORIGIN_CERTIFICATE" > /etc/ssl/easyflow.pem
echo "$CLOUDFLARE_ORIGIN_CA_KEY" > /etc/ssl/easyflow.key

#Start application
npx next start &

#Start nginx in the forground
nginx -g 'daemon off;'