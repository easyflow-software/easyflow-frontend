#!/bin/sh
#Exit when error happens
set -e

cat /etc/ssl/easyflow.pem
cat /etc/ssl/easyflow.key

#Start application
NODE_ENV=production bunx --bun next start &

#Start nginx in the forground
nginx -g 'daemon off;'