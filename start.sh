#!/bin/sh

# Start Node.js server in the background
cd /app && node src/server/server.js &

# Start nginx in the foreground
nginx -g 'daemon off;' 