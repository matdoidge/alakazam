#!/usr/bin/with-contenv sh

# Ensure directories exist
mkdir -p /usr/share/nginx/html /data

# Set permissions
chown -R nginx:nginx /usr/share/nginx/html || true
