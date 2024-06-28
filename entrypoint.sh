#!/bin/sh
#Exit when error happens
set -e

#Start application
NODE_ENV=production node dist/server/index.js &

#Start nginx in the forground
nginx -g 'daemon off;'