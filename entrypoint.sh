#!/bin/sh
#Exit when error happens
set -e

#Start application
NODE_ENV=production npx next start &

#Start nginx in the forground
nginx -g 'daemon off;'