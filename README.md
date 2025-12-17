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

### Via Home Assistant Add-on (Recommended - No HACS Required!)

<a href="https://my.home-assistant.io/redirect/supervisor_addon_repository/?repository_url=https://github.com/matdoidge/alakazam" target="_blank">
  <img src="https://my.home-assistant.io/badges/supervisor_addon_repository.svg" alt="Open your Home Assistant instance and add my add-on repository.">
</a>

**Or manually add the repository:**
1. In Home Assistant, go to **Settings** → **Add-ons** → **Add-on Store**
2. Click the three dots (⋮) in the top right → **Repositories**
3. Add: `https://github.com/matdoidge/alakazam`
4. Find **Alakazam Dashboard** and click **Install**
5. Click **Start** and then **Open Web UI**

**Benefits:**
- ✅ No HACS required
- ✅ Auto-updates from GitHub
- ✅ Proper MIME types (no errors!)
- ✅ Works out of the box

### Manual Installation (Alternative)

1. Download the latest release from the [releases page](https://github.com/matdoidge/alakazam-dashboard/releases)
2. Extract the files to your Home Assistant `www` directory: `/config/www/alakazam-dashboard/`
3. Add the resource in Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources**
   - Click **Add Resource**
   - URL: `/local/alakazam-dashboard/index.html`
   - Type: **JavaScript Module**

## Usage

### If installed via Add-on:
1. **Access directly via port 8080:**
   - URL: `http://homeassistant.local:8080` (or `http://YOUR_HA_IP:8080`)
   - Replace `homeassistant.local` with your Home Assistant IP address if needed

2. **Add to your dashboard as an iframe:**
   ```yaml
   type: iframe
   url: http://homeassistant.local:8080
   title: Alakazam Dashboard
   ```

**Note:** Ingress is disabled to avoid MIME type issues. Access the dashboard directly via port 8080.

### If installed manually:
1. After installation, go to **Settings** → **Dashboards**
2. Create a new dashboard or edit an existing one
3. Add a card with type: **Manual** or use the **Panel** view
4. Set the URL to: `/local/alakazam-dashboard/index.html`

## Configuration

The dashboard will automatically connect to your Home Assistant instance. On first use, you'll be prompted to authenticate.

## Troubleshooting

If you encounter any issues with the add-on:

1. **Check add-on logs**: Go to the add-on page and click **Logs**
2. **Verify the build**: Make sure you've built locally (`npm run build`) and committed the `build/` folder to the repo
3. **Restart the add-on**: Stop and start the add-on if updates aren't appearing
4. **Check configuration**: Verify the `github_repo`, `github_branch`, and `build_path` settings match your repository

## Development

### Building Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the dashboard:
   ```bash
   npm run build
   ```

3. **Commit the `build/` folder** to the repository:
   ```bash
   git add build/
   git commit -m "Update build"
   git push
   ```

The add-on will automatically download and serve the latest build from the `build/` folder in your repository.

### Tech Stack

This dashboard is built with:
- [SvelteKit](https://kit.svelte.dev/)
- [Home Assistant JS WebSocket](https://github.com/home-assistant/home-assistant-js-websocket)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

## License

This project is licensed under the MIT License.
