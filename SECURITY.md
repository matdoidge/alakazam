# Security & Privacy

## Overview

The Alakazam Dashboard uses **Home Assistant's built-in authentication system** and respects all of Home Assistant's security features. Your data is as secure as your Home Assistant instance itself.

## Authentication

### How It Works

1. **First Visit**: The dashboard prompts you to authenticate with Home Assistant (same login as the main UI)
2. **Token Storage**: Authentication tokens are stored in your browser's `localStorage` (same method Home Assistant uses)
3. **Token Validation**: Tokens are validated against your Home Assistant instance
4. **Automatic Re-authentication**: If tokens expire, you'll be prompted to log in again

### Security Features

- ✅ **Uses Home Assistant's official authentication** (`home-assistant-js-websocket`)
- ✅ **Respects Home Assistant permissions** - Users can only access what their HA account allows
- ✅ **No passwords stored** - Only authentication tokens (same as HA's own UI)
- ✅ **Token expiration** - Tokens expire and require re-authentication
- ✅ **Same security model** as Home Assistant's native dashboard

## Network Security

### Local Network Access

The add-on runs on **port 8080** by default. This should only be accessible on your local network.

**⚠️ Important Security Recommendations:**

1. **Don't expose port 8080 to the internet** without proper security:
   - Use a VPN to access your Home Assistant instance remotely
   - Use Home Assistant's built-in remote access (Nabu Casa Cloud)
   - Use a reverse proxy with authentication (e.g., Nginx with basic auth)

2. **Firewall Configuration**:
   - Only allow port 8080 from trusted networks
   - Block external access to port 8080

3. **If accessing remotely**:
   - Use HTTPS (set up SSL/TLS)
   - Use strong authentication
   - Consider using Home Assistant's ingress feature (though currently disabled due to MIME type issues)

### Accessing via Home Assistant UI (Recommended)

The safest way to access the dashboard is through Home Assistant's UI as an iframe:

```yaml
type: iframe
url: http://homeassistant.local:8080
title: Alakazam Dashboard
```

This way:
- ✅ You're already authenticated to Home Assistant
- ✅ The dashboard inherits Home Assistant's session
- ✅ No separate authentication needed

## Configuration Security

### What's Stored

The `dashboard_config` in the add-on configuration contains:
- ✅ **Entity IDs only** (e.g., `light.bedroom`, `calendar.my_calendar`)
- ✅ **Display labels** (e.g., "Bedroom Light")
- ❌ **NO passwords or tokens**
- ❌ **NO sensitive data**

### Configuration File Location

- **Add-on config**: `/mnt/data/supervisor/addons/data/alakazam_dashboard/options.json` (on host system)
- **Web config**: `/usr/share/nginx/html/config.json` (inside container)

**Security Notes:**
- The config file only contains entity IDs and labels
- Entity IDs are not sensitive - they're just identifiers
- Anyone with access to your Home Assistant instance can already see all entity IDs
- The config file does NOT contain authentication tokens or passwords

## Data Access

### What the Dashboard Can Access

The dashboard can only access:
- ✅ **What your Home Assistant user account can access**
- ✅ **Entities you've configured** in the dashboard config
- ✅ **Calendar events** from calendars you've added

### Permissions

The dashboard respects Home Assistant's user permissions:
- If your HA user can't access a calendar, the dashboard can't either
- If your HA user can't control a light, the dashboard can't either
- All actions go through Home Assistant's authentication system

## Privacy Considerations

### Calendar Data

- Calendar events are fetched directly from Home Assistant
- Events are displayed in your browser only
- No calendar data is stored or transmitted outside your Home Assistant instance
- Calendar data follows the same privacy rules as Home Assistant itself

### Entity Data

- Entity states are fetched via Home Assistant's WebSocket API
- Data is only displayed in your browser
- No entity data is stored or transmitted outside your Home Assistant instance

## Best Practices

### 1. Use Strong Home Assistant Authentication

- Use strong passwords for your Home Assistant account
- Enable 2FA (Two-Factor Authentication) if available
- Use Long-Lived Access Tokens with appropriate expiration

### 2. Network Security

- ✅ Keep the dashboard on your local network
- ✅ Use VPN for remote access
- ✅ Don't expose port 8080 to the internet without proper security
- ✅ Use HTTPS if accessing remotely

### 3. Access Control

- ✅ Only give dashboard access to trusted users
- ✅ Use Home Assistant's user management to control who can access what
- ✅ Regularly review who has access to your Home Assistant instance

### 4. Regular Updates

- ✅ Keep Home Assistant updated
- ✅ Keep the dashboard add-on updated
- ✅ Review security advisories for Home Assistant

### 5. Monitoring

- ✅ Monitor Home Assistant logs for unauthorized access attempts
- ✅ Review authentication logs regularly
- ✅ Check for unexpected entity access

## Comparison to Home Assistant's Native Dashboard

The Alakazam Dashboard uses **the exact same security model** as Home Assistant's built-in dashboard:

| Feature | Home Assistant Dashboard | Alakazam Dashboard |
|---------|-------------------------|-------------------|
| Authentication | Home Assistant Auth | ✅ Same |
| Token Storage | Browser localStorage | ✅ Same |
| Permissions | User-based | ✅ Same |
| Network Access | Local network | ✅ Same |
| Data Storage | None (browser only) | ✅ Same |

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to the repository maintainer
3. Include details about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Summary

**Your data is safe** because:

1. ✅ The dashboard uses Home Assistant's official authentication
2. ✅ It respects all Home Assistant permissions
3. ✅ No sensitive data is stored in configuration files
4. ✅ All data stays within your Home Assistant instance
5. ✅ The security model is identical to Home Assistant's native dashboard

**The main security consideration** is ensuring your Home Assistant instance itself is properly secured:
- Strong authentication
- Network security (don't expose to internet without proper protection)
- Regular updates
- User access control

If your Home Assistant instance is secure, the dashboard is secure.
