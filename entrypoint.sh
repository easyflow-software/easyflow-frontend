#!/bin/sh
#Exit when error happens
set -e

echo $CLOUDFLARE_ORIGIN_CERTIFICATE > /etc/ssl/easyflow.pem
echo $CLOUDFLARE_ORIGIN_CA_KEY > /etc/ssl/easyflow.key

#Start application
NODE_ENV=production bun --bun run start &

#Start nginx in the forground
nginx -g 'daemon off;'