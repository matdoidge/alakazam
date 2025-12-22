# Configuration Guide

The Alakazam Dashboard is fully configurable! You can customize which entities, calendars, and rooms are displayed without modifying the source code.

**📖 New to configuring?** Check out the [**Setup Guide**](SETUP_GUIDE.md) for step-by-step instructions, examples, and troubleshooting!

## Quick Start (Add-on Installation - Recommended)

1. **Open the add-on configuration:**
   - Go to **Settings** → **Add-ons** → **Alakazam Dashboard**
   - Click the **Configuration** tab

2. **Paste your dashboard config** in the `dashboard_config` field (see example below)

3. **Click "Save"** and **restart the add-on** - Your configuration will be loaded automatically!

**Note:** The configuration is validated as JSON. If invalid, the dashboard will use defaults and show an error in the logs.

## Configuration Methods

### Method 1: Add-on Configuration Page (Recommended)
- **Location:** Add-on Configuration tab in Home Assistant UI
- **Field:** `dashboard_config` (multiline text field)
- **Benefits:** 
  - ✅ Easy to edit through the UI
  - ✅ Validated automatically
  - ✅ Persists across updates
  - ✅ No SSH required

### Method 2: Manual File Editing (Advanced)
- **Location:** `/config/addons/data/alakazam_dashboard/options.json`
- **Field:** Edit the `dashboard_config` field in the JSON file
- **Use case:** For advanced users who prefer file editing

### Method 3: Manual Installation (Without Add-on)
- **Location:** Same directory as `index.html`
- **File:** `config.json`
- **Example:** `/config/www/alakazam-dashboard/config.json`

## Example Configuration

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
    ]
  }
}
```

## Tile Types Reference

### Light
```json
{
  "type": "light",
  "entityId": "light.bedroom",
  "label": "Bedroom Light"
}
```

### Switch
```json
{
  "type": "switch",
  "entityId": "switch.smart_plug",
  "label": "Smart Plug"
}
```

### Sensor
```json
{
  "type": "sensor",
  "entityId": "sensor.temperature",
  "label": "Temperature",
  "unit": "°C",
  "format": "date"  // Optional: for date formatting
}
```

### Binary Sensor
```json
{
  "type": "binary_sensor",
  "entityId": "binary_sensor.door",
  "label": "Front Door",
  "deviceClass": "door"  // Options: "door", "window", "motion", "garage", "problem"
}
```

### Media Player
```json
{
  "type": "media",
  "entityId": "media_player.tv",
  "label": "TV",
  "temperatureEntityId": "sensor.tv_temperature"  // Optional
}
```

### Calendar
```json
{
  "type": "calendar",
  "entityId": "calendar.my_calendar",
  "label": "Upcoming Events",
  "maxEvents": 5,        // Number of events to show
  "daysAhead": 7,        // How many days ahead to fetch
  "showTitle": true      // Show/hide calendar title
}
```

### Status Grid (Multiple Sensors)
```json
{
  "type": "statusGrid",
  "entityIds": [
    "binary_sensor.door1",
    "binary_sensor.door2",
    "binary_sensor.window1"
  ],
  "labels": {
    "binary_sensor.door1": "Front Door",
    "binary_sensor.door2": "Back Door"
  },
  "deviceClass": "door",  // Default device class
  "showSummary": false,   // Show summary count
  "hideUnavailable": false, // Hide unavailable sensors
  "sortByState": true     // Sort with active sensors first
}
```

### Arm (Security System)
```json
{
  "type": "arm",
  "entityId": "input_boolean.security_armed",
  "label": "Arm Security"
}
```

### Automation
```json
{
  "type": "automation",
  "entityId": "automation.goodnight",
  "label": "Goodnight Scene"
}
```

## Finding Entity IDs

1. Go to **Settings** → **Devices & Services** → **Entities**
2. Search for your device
3. Copy the entity ID (e.g., `light.bedroom_lamp`)

For calendars:
- Go to **Settings** → **Devices & Services** → **CalDAV** (or your calendar integration)
- Find your calendar and copy its entity ID (e.g., `calendar.my_calendar`)

## Default Configuration

If no `config.json` is found, the dashboard will use the default configuration (Mat's setup) as a fallback. This ensures the dashboard always works, even without custom configuration.

## Merging with Defaults

When you provide a `config.json`:
- **People**: Your `people` array replaces the defaults entirely
- **Rooms**: Your rooms are merged with defaults (your rooms override defaults with the same name)

To completely replace all defaults, provide both `people` and all `rooms` in your config.

## Tips

- **Room names are flexible**: Use any room name you want (e.g., "Kitchen", "Office", "Outdoor")
- **Order matters**: Rooms appear in the order you define them
- **Multiple calendars**: Add multiple calendar tiles in different rooms
- **Custom labels**: Use `label` to give friendly names to entities
- **Units**: Add `unit` to sensors for proper display (e.g., "°C", "%", "W")

## Troubleshooting

- **Config not loading?** Check the browser console for errors
- **Entities not showing?** Verify entity IDs exist in Home Assistant
- **Calendar not working?** Ensure the calendar entity ID is correct and the calendar has events
- **Changes not appearing?** Restart the add-on after editing `config.json`
