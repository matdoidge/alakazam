#!/bin/sh
set -e

GITHUB_REPO="${GITHUB_REPO:-matdoidge/alakazam}"
GITHUB_BRANCH="${GITHUB_BRANCH:-main}"
BUILD_PATH="${BUILD_PATH:-build}"
WEB_ROOT="/usr/share/nginx/html"
TEMP_DIR="/tmp/dashboard-update"

echo "Updating dashboard from ${GITHUB_REPO} (branch: ${GITHUB_BRANCH}, path: ${BUILD_PATH})..."

# Create temp directory
mkdir -p "${TEMP_DIR}"
cd "${TEMP_DIR}"

# Download latest from GitHub
echo "Downloading latest from GitHub..."
curl -L "https://github.com/${GITHUB_REPO}/archive/refs/heads/${GITHUB_BRANCH}.zip" -o dashboard.zip

# Extract
unzip -q dashboard.zip
rm dashboard.zip

# Find the extracted directory
EXTRACTED_DIR=$(find . -maxdepth 1 -type d ! -name . | head -1)
BUILD_DIR="${EXTRACTED_DIR}/${BUILD_PATH}"

# Copy files to web root
if [ -f "${BUILD_DIR}/index.html" ]; then
    echo "Copying files from ${BUILD_PATH} to web root..."
    # Clear web root first
    rm -rf "${WEB_ROOT}"/*
    # Copy all files from build directory
    cp -r "${BUILD_DIR}"/* "${WEB_ROOT}/" 2>/dev/null || true
    # Ensure index.html exists
    if [ ! -f "${WEB_ROOT}/index.html" ]; then
        cp "${BUILD_DIR}/index.html" "${WEB_ROOT}/" || exit 1
    fi
    echo "✓ Dashboard updated successfully"
    echo "  Files in web root: $(ls -1 ${WEB_ROOT} | wc -l)"
else
    echo "✗ ERROR: index.html not found in ${BUILD_PATH} directory"
    echo "  Make sure you've built the app locally and committed the ${BUILD_PATH} folder"
    exit 1
fi

# Cleanup
rm -rf "${TEMP_DIR}"
