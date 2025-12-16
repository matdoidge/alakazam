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

If you see a blank page or errors about "disallowed MIME type" in the browser console, Home Assistant's web server may not be serving JavaScript files with the correct MIME type.

**Solution 1: Configure Home Assistant (Recommended)**

Add this to your `configuration.yaml`:

```yaml
http:
  use_x_forwarded_for: true
  trusted_proxies:
    - 127.0.0.1
    - ::1
```

Then restart Home Assistant.

**Solution 2: Use a Reverse Proxy**

If you're using Nginx or another reverse proxy, ensure it's configured to serve `.js` files with the correct MIME type:

```nginx
types {
    application/javascript js mjs;
    text/css css;
}
```

**Solution 3: Clear Browser Cache**

Sometimes clearing your browser cache (Ctrl+F5 or Cmd+Shift+R) resolves cached MIME type issues.

## Development

This dashboard is built with:
- [SvelteKit](https://kit.svelte.dev/)
- [Home Assistant JS WebSocket](https://github.com/home-assistant/home-assistant-js-websocket)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## License

This project is licensed under the MIT License.
