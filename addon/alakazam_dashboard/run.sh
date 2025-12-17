#!/bin/sh
set -e

# Load options
if [ -f /data/options.json ]; then
    UPDATE_INTERVAL=$(jq -r '.update_interval // 3600' /data/options.json)
    GITHUB_REPO=$(jq -r '.github_repo // "matdoidge/alakazam"' /data/options.json)
    GITHUB_BRANCH=$(jq -r '.github_branch // "main"' /data/options.json)
    BUILD_PATH=$(jq -r '.build_path // "dist"' /data/options.json)
else
    UPDATE_INTERVAL=3600
    GITHUB_REPO="matdoidge/alakazam"
    GITHUB_BRANCH="main"
    BUILD_PATH="dist"
fi

export GITHUB_REPO
export GITHUB_BRANCH
export BUILD_PATH

# Initial update
echo "Performing initial dashboard update..."
/usr/bin/update-dashboard.sh || echo "Initial update failed, continuing with existing files"

# Start update loop in background
(
    while true; do
        sleep "${UPDATE_INTERVAL}"
        echo "Checking for dashboard updates..."
        /usr/bin/update-dashboard.sh || echo "Update failed, will retry later"
    done
) &

# Start nginx in foreground (this keeps the container running)
exec nginx -g "daemon off;"
