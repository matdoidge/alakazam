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

## Development

This dashboard is built with:
- [SvelteKit](https://kit.svelte.dev/)
- [Home Assistant JS WebSocket](https://github.com/home-assistant/home-assistant-js-websocket)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## License

This project is licensed under the MIT License.
