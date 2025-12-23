# Alakazam Dashboard Add-on

A standalone Home Assistant add-on that serves the Alakazam Dashboard and auto-updates from GitHub.

## Features

- ✅ **No HACS required** - Standalone add-on
- ✅ **Auto-updates** - Pulls latest build from GitHub automatically
- ✅ **Proper MIME types** - Nginx serves files with correct Content-Type headers
- ✅ **Fully configurable** - Customize which entities, calendars, and rooms are displayed
- ✅ **Easy configuration** - Large textarea field for editing your dashboard setup

## Installation

1. In Home Assistant, go to **Settings** → **Add-ons** → **Add-on Store**
2. Click the three dots (⋮) → **Repositories**
3. Add: `https://github.com/matdoidge/alakazam`
4. Find **Alakazam Dashboard** and click **Install**
5. Click **Start**

## Configuration

### Dashboard Configuration

The dashboard is fully configurable! You can customize which entities, calendars, and rooms are displayed to match your Home Assistant setup.

#### Quick Start

1. **Open the add-on configuration:**
   - Go to **Settings** → **Add-ons** → **Alakazam Dashboard**
   - Click **Configuration** tab

2. **Find the `dashboard_config` field** - This is a **large 20-line textarea** perfect for editing JSON

3. **Paste your configuration** (see examples below)

4. **Click "Save"** and **restart the add-on**

**Important Notes:**
- ✅ The `dashboard_config` field is a **large textarea (20 lines)** - easy to see and edit your full configuration
- ✅ Configuration uses **JSON format** (not YAML) - use double quotes for strings
- ✅ Configuration is validated automatically - if invalid, the dashboard uses defaults and shows an error in logs
- ✅ **Leave `dashboard_config` empty** to use the default configuration (perfect for testing!)

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

### Add-on Configuration Options

- `update_interval`: How often to check for updates (in seconds, default: 3600 = 1 hour)
- `github_repo`: GitHub repository (default: `matdoidge/alakazam`)
- `github_branch`: Branch to use (default: `main`)
- `build_path`: Path to build directory (default: `build`)
- `dashboard_config`: **Your dashboard configuration JSON** (large 20-line textarea)

## Usage

After installation, access the dashboard at:
- **Direct URL**: `http://YOUR_HA_IP:8080` (replace with your Home Assistant IP)
- **Note**: Ingress is disabled to avoid MIME type issues - access directly via port 8080

Add to your dashboard as an iframe:
```yaml
type: iframe
url: http://YOUR_HA_IP:8080
title: Alakazam Dashboard
```

## How It Works

1. The add-on runs an Nginx web server
2. On startup, it downloads the latest build from your GitHub repo
3. It periodically checks for updates (configurable interval)
4. Nginx serves the files with proper MIME types
5. The dashboard connects to Home Assistant automatically
6. Your `dashboard_config` is written to the web root for the dashboard to load

## Troubleshooting

**Dashboard not updating?**
- Check add-on logs for errors
- Verify the build folder exists in your GitHub repo
- Restart the add-on to force an immediate update

**Configuration not working?**
- Check the add-on logs for JSON validation errors
- Verify your JSON is valid (use a JSON validator)
- Make sure entity IDs exist in Home Assistant
- Leave `dashboard_config` empty to test with defaults

**Can't access the dashboard?**
- Make sure the add-on is started
- Access via `http://YOUR_HA_IP:8080` (not via "Open Web UI" button)
- Check firewall settings if accessing remotely

## Benefits Over HACS

- ✅ No subdirectory download issues
- ✅ Proper MIME type handling
- ✅ Auto-updates from your repo
- ✅ Full control over the serving environment
- ✅ Works with any build structure
- ✅ Easy configuration via add-on UI
