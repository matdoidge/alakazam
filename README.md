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

**💡 Important:** When authenticating, check **"Create a Long-Lived Access Token"** to ensure persistent login. Without this, you'll need to log in repeatedly.

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

The dashboard is fully configurable! You can customize which entities, calendars, and rooms are displayed to match your Home Assistant setup.

**📖 New to configuring?** See the [**Setup Guide**](SETUP_GUIDE.md) for step-by-step instructions and examples!

#### Quick Start: Using the Add-on Configuration Page

1. **Open the add-on configuration:**
   - Go to **Settings** → **Add-ons** → **Alakazam Dashboard**
   - Click **Configuration** tab

2. **Find the `dashboard_config` field** - Paste your JSON configuration here

3. **Click "Save"** and **restart the add-on**

**⚠️ Important Notes:**
- ⚠️ The `dashboard_config` field is a **single-line text field** (Home Assistant add-ons don't support multiline textareas)
- ✅ You can paste multiline JSON - it will work, but it's harder to see/edit in the single-line field
- ✅ **Better option**: Edit the config file directly using File Editor add-on (see below)
- ✅ Configuration uses **JSON format** (not YAML) - use double quotes for strings
- ✅ Configuration is validated automatically - if invalid, the dashboard uses defaults and shows an error in logs
- ✅ **Leave `dashboard_config` empty** to use the default configuration (perfect for testing!)

#### Easy Configuration Editing (Recommended)

Since the add-on config field is single-line, here's an easier way to edit your configuration:

**Using File Editor Add-on (Easiest):**
1. Install the **File Editor** add-on (Settings → Add-ons → Add-on Store → File Editor)
2. Open File Editor and navigate to: `/config/addons/data/alakazam_dashboard/options.json`
3. Edit the `dashboard_config` field - you'll have a full editor with syntax highlighting!
4. Save and restart the Alakazam Dashboard add-on

**Alternative: Using Terminal/SSH:**
1. SSH into Home Assistant or use the Terminal add-on
2. Edit: `/config/addons/data/alakazam_dashboard/options.json`
3. Use your favorite editor (nano, vi, etc.)
4. Restart the add-on

#### Configuration Structure

Your configuration has two main sections:

1. **`people`** - Array of person entities to display at the top
2. **`rooms`** - Object where each key is a room name and value is an array of tiles

#### Example Configurations

**Minimal Example (Single Room):**
```json
{
  "people": [],
  "rooms": {
    "Living Room": [
      {
        "type": "light",
        "entityId": "light.living_room",
        "label": "Living Room Light"
      }
    ]
  }
}
```

**Complete Example (Multiple Rooms):**
```json
{
  "people": [
    {
      "entityId": "person.john_doe",
      "label": "John",
      "batteryEntityId": "sensor.john_phone_battery"
    }
  ],
  "rooms": {
    "Living Room": [
      {
        "type": "light",
        "entityId": "light.living_room",
        "label": "Living Room Light"
      },
      {
        "type": "switch",
        "entityId": "switch.smart_plug",
        "label": "Smart Plug"
      },
      {
        "type": "media",
        "entityId": "media_player.tv",
        "label": "TV"
      }
    ],
    "Bedroom": [
      {
        "type": "light",
        "entityId": "light.bedroom",
        "label": "Bedroom Light"
      },
      {
        "type": "sensor",
        "entityId": "sensor.bedroom_temperature",
        "label": "Temperature",
        "unit": "°C"
      }
    ],
    "Calendar": [
      {
        "type": "calendar",
        "entityId": "calendar.my_calendar",
        "label": "Upcoming Events",
        "maxEvents": 5,
        "daysAhead": 7,
        "showTitle": true
      }
    ],
    "Security": [
      {
        "type": "statusGrid",
        "entityIds": [
          "binary_sensor.front_door",
          "binary_sensor.back_door"
        ],
        "labels": {
          "binary_sensor.front_door": "Front Door",
          "binary_sensor.back_door": "Back Door"
        },
        "deviceClass": "door",
        "showSummary": false
      }
    ]
  }
}
```

#### Finding Your Entity IDs

Before configuring, you need to know your entity IDs:

1. Go to **Settings** → **Devices & Services** → **Entities**
2. Search for your device (e.g., "bedroom light")
3. Click on the entity
4. Copy the **Entity ID** (e.g., `light.bedroom_lamp`)

**Common Entity Types:**
- **Lights**: `light.bedroom_lamp`, `light.living_room`
- **Switches**: `switch.smart_plug`, `switch.outlet`
- **Sensors**: `sensor.temperature`, `sensor.humidity`
- **Binary Sensors**: `binary_sensor.door`, `binary_sensor.motion`
- **Media Players**: `media_player.tv`, `media_player.speaker`
- **Calendars**: `calendar.my_calendar`, `calendar.google_calendar`
- **Persons**: `person.john_doe`, `person.jane_doe`

#### Available Tile Types

| Type | Description | Required Fields | Optional Fields |
|------|-------------|----------------|----------------|
| `light` | Control lights with brightness | `entityId`, `label` | - |
| `switch` | Control switches/plugs | `entityId`, `label` | - |
| `sensor` | Display sensor values | `entityId`, `label` | `unit`, `format` |
| `binary_sensor` | Show on/off states | `entityId`, `label` | `deviceClass` |
| `media` | Control media players | `entityId`, `label` | `temperatureEntityId` |
| `calendar` | Display calendar events | `entityId`, `label` | `maxEvents`, `daysAhead`, `showTitle` |
| `statusGrid` | Grid of multiple sensors | `entityIds[]`, `deviceClass` | `labels`, `showSummary` |
| `arm` | Security system control | `entityId`, `label` | - |
| `automation` | Trigger automations | `entityId`, `label` | - |

**See [SETUP_GUIDE.md](SETUP_GUIDE.md) for:**
- Detailed step-by-step setup instructions
- More configuration examples
- Common use cases (lights only, security dashboard, media center, etc.)
- Troubleshooting tips

#### Configuration Tips

**Getting Started:**
1. Start simple - add one room with one light to test
2. Use the default config as a reference - it shows all available tile types
3. Copy and modify the examples above - replace entity IDs with your own
4. Test incrementally - add one room at a time

**Common Patterns:**

**Room-by-Room Setup:**
```json
{
  "people": [],
  "rooms": {
    "Kitchen": [
      { "type": "light", "entityId": "light.kitchen", "label": "Kitchen Light" },
      { "type": "switch", "entityId": "switch.coffee_maker", "label": "Coffee Maker" }
    ],
    "Bedroom": [
      { "type": "light", "entityId": "light.bedroom", "label": "Bedroom Light" },
      { "type": "sensor", "entityId": "sensor.bedroom_temperature", "label": "Temp", "unit": "°C" }
    ]
  }
}
```

**Calendar Focus:**
```json
{
  "people": [],
  "rooms": {
    "Calendar": [
      {
        "type": "calendar",
        "entityId": "calendar.personal",
        "label": "Personal Calendar",
        "maxEvents": 10,
        "daysAhead": 14
      }
    ]
  }
}
```

**Security Dashboard:**
```json
{
  "people": [],
  "rooms": {
    "Security": [
      {
        "type": "statusGrid",
        "entityIds": [
          "binary_sensor.front_door",
          "binary_sensor.back_door",
          "binary_sensor.garage_door"
        ],
        "labels": {
          "binary_sensor.front_door": "Front Door",
          "binary_sensor.back_door": "Back Door"
        },
        "deviceClass": "door",
        "showSummary": true
      }
    ]
  }
}
```

#### Advanced Options

**Manual File Editing (Alternative Method):**
If you prefer to edit files directly:
1. SSH into your Home Assistant instance (or use the Terminal add-on)
2. Navigate to: `/config/addons/data/alakazam_dashboard/`
3. Edit `options.json` and add your config to the `dashboard_config` field
4. Restart the add-on

**Manual Installation (Without Add-on):**
1. Copy `config.example.json` from the repository to your installation directory
2. Rename it to `config.json`
3. Edit it with your entities
4. Place it in the same directory as `index.html`

For complete documentation, see [CONFIGURATION.md](CONFIGURATION.md) and [SETUP_GUIDE.md](SETUP_GUIDE.md).

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
