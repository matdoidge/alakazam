# Alakazam Dashboard

A beautiful, modern dashboard for Home Assistant built with SvelteKit.

## Installation

### Via Home Assistant Add-on (Recommended)

**To install the add-on, visit the [source repository](https://github.com/matdoidge/alakazam) and use the "Add to Home Assistant" button there.**

The add-on will automatically download and serve the latest build from this repository.

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/matdoidge/alakazam-dashboard/releases)
2. Extract the files to your Home Assistant `www` directory: `/config/www/alakazam-dashboard/`
3. Add the resource in Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources**
   - Click **Add Resource**
   - URL: `/local/alakazam-dashboard/index.html`
   - Type: **JavaScript Module**

## Usage

### If installed via Add-on:
1. Simply click **Open Web UI** in the add-on
2. Or add to your dashboard as an iframe:
   - URL: `http://homeassistant.local:8080` (or use Ingress URL)

### If installed manually:
1. After installation, go to **Settings** → **Dashboards**
2. Create a new dashboard or edit an existing one
3. Add a card with type: **Manual** or use the **Panel** view
4. Set the URL to: `/local/alakazam-dashboard/index.html`

## Configuration

The dashboard will automatically connect to your Home Assistant instance. On first use, you'll be prompted to authenticate.

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

## Development

This dashboard is built with:
- [SvelteKit](https://kit.svelte.dev/)
- [Home Assistant JS WebSocket](https://github.com/home-assistant/home-assistant-js-websocket)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## License

This project is licensed under the MIT License.
