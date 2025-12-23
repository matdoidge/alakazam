#!/bin/sh
# Write dashboard config from add-on options to web root

WEB_ROOT="/usr/share/nginx/html"
OPTIONS_FILE="/data/options.json"

# Check if options file exists
if [ ! -f "${OPTIONS_FILE}" ]; then
    echo "No options.json found, dashboard will use defaults"
    rm -f "${WEB_ROOT}/config.json"
    exit 0
fi

# Check if dashboard_config is provided and not empty
DASHBOARD_CONFIG=$(jq -r '.dashboard_config // ""' "${OPTIONS_FILE}" 2>/dev/null || echo "")

# Trim whitespace
DASHBOARD_CONFIG=$(echo "${DASHBOARD_CONFIG}" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

if [ -n "${DASHBOARD_CONFIG}" ] && [ "${DASHBOARD_CONFIG}" != "null" ] && [ "${DASHBOARD_CONFIG}" != "" ]; then
    echo "Writing dashboard config from add-on configuration..."
    
    # Validate JSON by trying to parse it
    if echo "${DASHBOARD_CONFIG}" | jq . >/dev/null 2>&1; then
        # Write config to web root
        echo "${DASHBOARD_CONFIG}" > "${WEB_ROOT}/config.json"
        echo "✓ Dashboard config written successfully"
        echo "  Config size: $(wc -c < "${WEB_ROOT}/config.json") bytes"
    else
        echo "✗ ERROR: Invalid JSON in dashboard_config"
        echo "  Please check your configuration in the add-on settings"
        echo "  Dashboard will use defaults until configuration is fixed"
        # Remove invalid config to ensure defaults are used
        rm -f "${WEB_ROOT}/config.json"
    fi
else
    echo "No dashboard_config provided, dashboard will use defaults"
    # Remove config.json if it exists (to ensure defaults are used)
    rm -f "${WEB_ROOT}/config.json"
fi
