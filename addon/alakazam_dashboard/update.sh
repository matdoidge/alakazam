#!/bin/sh
set -e

GITHUB_REPO="${GITHUB_REPO:-matdoidge/alakazam-dashboard}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"
WEB_ROOT="/usr/share/nginx/html"
TEMP_DIR="/tmp/dashboard-update"

echo "Updating dashboard from ${GITHUB_REPO} (branch: ${GITHUB_BRANCH})..."

# Create temp directory
mkdir -p "${TEMP_DIR}"
cd "${TEMP_DIR}"

# Download latest build from GitHub
echo "Downloading latest build..."
curl -L "https://github.com/${GITHUB_REPO}/archive/refs/heads/${GITHUB_BRANCH}.zip" -o dashboard.zip

# Extract
unzip -q dashboard.zip
rm dashboard.zip

# Find the extracted directory
EXTRACTED_DIR=$(find . -maxdepth 1 -type d ! -name . | head -1)

# Copy files to web root
if [ -f "${EXTRACTED_DIR}/index.html" ]; then
    echo "Copying files to web root..."
    # Clear web root first
    rm -rf "${WEB_ROOT}"/*
    # Copy all files (works for both single-file and multi-file builds)
    cp -r "${EXTRACTED_DIR}"/* "${WEB_ROOT}/" 2>/dev/null || true
    # Ensure index.html exists
    if [ ! -f "${WEB_ROOT}/index.html" ]; then
        cp "${EXTRACTED_DIR}/index.html" "${WEB_ROOT}/" || exit 1
    fi
    echo "✓ Dashboard updated successfully"
    echo "  Files in web root: $(ls -1 ${WEB_ROOT} | wc -l)"
else
    echo "✗ ERROR: index.html not found in downloaded files"
    exit 1
fi

# Cleanup
rm -rf "${TEMP_DIR}"
