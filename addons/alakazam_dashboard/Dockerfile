ARG BUILD_FROM
FROM $BUILD_FROM

# Install nginx, git, curl, jq, and unzip
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

# Copy config writer script
COPY write-config.sh /usr/bin/write-config.sh
RUN chmod +x /usr/bin/write-config.sh

# Copy start script
COPY run.sh /usr/bin/run.sh
RUN chmod +x /usr/bin/run.sh

# Copy s6-overlay service files
COPY rootfs/ /

# Expose port
EXPOSE 8080
