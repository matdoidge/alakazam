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

### Security & Privacy

**Your data is safe!** The dashboard uses Home Assistant's built-in authentication system and respects all Home Assistant permissions. Your calendar and entity data are only accessible to authenticated users, just like Home Assistant's native dashboard.

**Key Security Points:**
- ✅ Uses Home Assistant's official authentication (same as the main UI)
- ✅ Respects Home Assistant user permissions
- ✅ No passwords or tokens stored in configuration files
- ✅ All data stays within your Home Assistant instance
- ✅ Same security model as Home Assistant's native dashboard

**Important:** Keep port 8080 on your local network only. Don't expose it to the internet without proper security (VPN, reverse proxy with auth, etc.).

See [SECURITY.md](SECURITY.md) for detailed security information.

### Customizing Your Dashboard

The dashboard is fully configurable! You can customize which entities, calendars, and rooms are displayed.

#### Option 1: Using the Add-on Configuration Page (Recommended)

1. **Open the add-on configuration:**
   - Go to **Settings** → **Add-ons** → **Alakazam Dashboard**
   - Click **Configuration** tab

2. **Paste your dashboard config** in the `dashboard_config` field:
   ```json
   {
     "people": [
       {
         "entityId": "person.your_person_entity",
         "label": "Your Name",
         "batteryEntityId": "sensor.your_battery_sensor"
       }
     ],
     "rooms": {
       "Living Room": [
         { "type": "light", "entityId": "light.living_room", "label": "Living Room Light" },
         { "type": "switch", "entityId": "switch.smart_plug", "label": "Smart Plug" }
       ],
       "Calendar": [
         {
           "type": "calendar",
           "entityId": "calendar.your_calendar",
           "label": "Upcoming Events",
           "maxEvents": 5,
           "daysAhead": 7,
           "showTitle": true
         }
       ]
     }
   }
   ```

3. **Click "Save"** and **restart the add-on** - Your custom configuration will be loaded automatically!

**Note:** The configuration is validated as JSON. If invalid, the dashboard will use defaults and show an error in the logs.

#### Option 2: Manual File Editing (Advanced)

If you prefer to edit files directly:

1. SSH into your Home Assistant instance (or use the Terminal add-on)
2. Navigate to: `/config/addons/data/alakazam_dashboard/`
3. Edit `options.json` and add your config to the `dashboard_config` field
4. Restart the add-on

#### Option 3: Manual Installation (Without Add-on)

1. Copy `config.example.json` from the repository to your installation directory
2. Rename it to `config.json`
3. Edit it with your entities
4. Place it in the same directory as `index.html`

#### Configuration Reference

**People:**
- `entityId`: Person entity ID (e.g., `person.john_doe`)
- `label`: Display name
- `batteryEntityId` (optional): Battery sensor entity ID

**Rooms:** Each room is an object with an array of tiles:
- `type`: One of: `light`, `switch`, `sensor`, `binary_sensor`, `media`, `arm`, `automation`, `calendar`, `statusGrid`
- `entityId`: Entity ID for the tile
- `label`: Display label
- Additional properties depend on tile type (see examples below)

**Tile Types:**

- **Light**: `{ "type": "light", "entityId": "light.bedroom", "label": "Bedroom Light" }`
- **Switch**: `{ "type": "switch", "entityId": "switch.smart_plug", "label": "Smart Plug" }`
- **Sensor**: `{ "type": "sensor", "entityId": "sensor.temperature", "label": "Temperature", "unit": "°C" }`
- **Binary Sensor**: `{ "type": "binary_sensor", "entityId": "binary_sensor.door", "label": "Front Door", "deviceClass": "door" }`
- **Media Player**: `{ "type": "media", "entityId": "media_player.tv", "label": "TV", "temperatureEntityId": "sensor.tv_temp" }`
- **Calendar**: `{ "type": "calendar", "entityId": "calendar.my_calendar", "label": "Events", "maxEvents": 5, "daysAhead": 7 }`
- **Status Grid**: `{ "type": "statusGrid", "entityIds": ["binary_sensor.door1", "binary_sensor.door2"], "deviceClass": "door" }`

**Note:** If no `config.json` is found, the dashboard will use the default configuration (Mat's setup) as a fallback.

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
