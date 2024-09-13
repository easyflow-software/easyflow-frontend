#!/bin/sh
#Exit when error happens
set -e

#Start application
NODE_ENV=production bunx --bun next start &

#Start nginx in the forground
nginx -g 'daemon off;'