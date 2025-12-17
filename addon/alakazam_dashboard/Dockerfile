ARG BUILD_FROM
FROM $BUILD_FROM

# Install nginx, git, and unzip
RUN \
    apk add --no-cache \
        nginx \
        git \
        curl \
        jq \
        unzip

# Create directories
RUN mkdir -p /usr/share/nginx/html /data

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy update script
COPY update.sh /usr/bin/update-dashboard.sh
RUN chmod +x /usr/bin/update-dashboard.sh

# Expose port
EXPOSE 8080

# Start script
COPY run.sh /usr/bin/run.sh
RUN chmod +x /usr/bin/run.sh

CMD [ "/usr/bin/run.sh" ]
