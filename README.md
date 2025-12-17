# Alakazam Dashboard

A beautiful, modern dashboard for Home Assistant built with SvelteKit.

## Features

- 🎨 Modern, responsive UI with dark mode support
- 💡 Light controls with brightness adjustment
- 🔌 Switch and automation controls
- 👤 Person presence tracking
- 📊 Sensor monitoring
- 📅 Calendar integration
- 🎵 Media player controls
- 🔒 Security system (alarm) controls
- 📱 Mobile-friendly design

## Installation

### Via HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to **Frontend** → **Explore & Download Repositories**
3. Search for **Alakazam Dashboard**
4. Click **Download**
5. Restart Home Assistant

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/matdoidge/alakazam-dashboard/releases)
2. Extract the files to your Home Assistant `www` directory: `/config/www/alakazam-dashboard/`
3. Add the resource in Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources**
   - Click **Add Resource**
   - URL: `/local/alakazam-dashboard/index.html`
   - Type: **JavaScript Module**

## Usage

1. After installation, go to **Settings** → **Dashboards**
2. Create a new dashboard or edit an existing one
3. Add a card with type: **Manual** or use the **Panel** view
4. Set the URL to: `/hacsfiles/alakazam-dashboard/index.html` (if installed via HACS) or `/local/alakazam-dashboard/index.html` (if manual)

## Configuration

The dashboard will automatically connect to your Home Assistant instance. On first use, you'll be prompted to authenticate.

## Troubleshooting

### Blank Page / MIME Type Errors

If you see a blank page or errors about "disallowed MIME type" in the browser console, Home Assistant's web server is serving JavaScript files with the wrong MIME type (`text/plain` instead of `application/javascript`). This is a known limitation of Home Assistant's built-in web server.

**Solution 1: Use a Reverse Proxy (Recommended)**

If you're using Nginx, Traefik, or another reverse proxy, configure it to serve files from `/hacsfiles/` with correct MIME types:

**Nginx example:**
```nginx
location /hacsfiles/ {
    types {
        application/javascript js mjs;
        text/css css;
    }
}
```

**Traefik example:**
Add MIME type configuration in your Traefik config.

**Solution 2: Manual Installation (Workaround)**

Instead of using HACS, manually install to `/config/www/`:

1. Download the latest release
2. Extract to `/config/www/alakazam-dashboard/`
3. Access at `/local/alakazam-dashboard/index.html`

This sometimes works better than HACS for MIME type issues.

**Solution 3: Report to HACS**

This is a known issue with HACS frontend integrations. Consider reporting it to the [HACS repository](https://github.com/hacs/integration/issues) so they can fix the MIME type handling.

**Note:** The HTTP configuration in `configuration.yaml` does not fix this issue, as Home Assistant's Python web server doesn't respect those settings for `/hacsfiles/` paths.

## Development

This dashboard is built with:
- [SvelteKit](https://kit.svelte.dev/)
- [Home Assistant JS WebSocket](https://github.com/home-assistant/home-assistant-js-websocket)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## License

This project is licensed under the MIT License.
