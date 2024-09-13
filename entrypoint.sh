#!/bin/sh
#Exit when error happens
set -e

#Start application
NODE_ENV=production bun --bun next start &

#Start nginx in the forground
nginx -g 'daemon off;'