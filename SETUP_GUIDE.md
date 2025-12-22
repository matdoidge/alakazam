# Alakazam Dashboard Setup Guide

A step-by-step guide to setting up and configuring your Alakazam Dashboard.

## Table of Contents

1. [Installation](#installation)
2. [Initial Setup](#initial-setup)
3. [Finding Your Entity IDs](#finding-your-entity-ids)
4. [Configuration Examples](#configuration-examples)
5. [Common Configurations](#common-configurations)
6. [Troubleshooting](#troubleshooting)

## Installation

### Step 1: Install the Add-on

1. In Home Assistant, go to **Settings** → **Add-ons** → **Add-on Store**
2. Click the three dots (⋮) in the top right → **Repositories**
3. Add: `https://github.com/matdoidge/alakazam`
4. Find **Alakazam Dashboard** and click **Install**
5. Click **Start**

### Step 2: Access the Dashboard

1. Open the add-on page
2. Click **Open Web UI** (or access directly at `http://YOUR_HA_IP:8080`)
3. On first visit, you'll be prompted to authenticate with Home Assistant
4. Enter your Home Assistant username and password
5. **Important:** Check "Create a Long-Lived Access Token" for persistent login

## Initial Setup

### First Login

When you first access the dashboard:

1. **You'll see an authentication prompt**
2. **Enter your Home Assistant credentials**
3. **Check "Create a Long-Lived Access Token"** - This ensures you won't have to log in repeatedly
4. Click **Submit**

The dashboard will remember your login and you won't need to authenticate again unless you clear your browser data.

## Finding Your Entity IDs

Before configuring the dashboard, you need to know your entity IDs. Here's how to find them:

### Method 1: Home Assistant UI

1. Go to **Settings** → **Devices & Services** → **Entities**
2. Search for your device (e.g., "bedroom light")
3. Click on the entity
4. Copy the **Entity ID** (e.g., `light.bedroom_lamp`)

### Method 2: Developer Tools

1. Go to **Settings** → **Developer Tools** → **States**
2. Browse or search for your entities
3. Copy the entity ID from the list

### Common Entity Types

- **Lights**: `light.bedroom_lamp`, `light.living_room`
- **Switches**: `switch.smart_plug`, `switch.outlet`
- **Sensors**: `sensor.temperature`, `sensor.humidity`
- **Binary Sensors**: `binary_sensor.door`, `binary_sensor.motion`
- **Media Players**: `media_player.tv`, `media_player.speaker`
- **Calendars**: `calendar.my_calendar`, `calendar.google_calendar`
- **Persons**: `person.john_doe`, `person.jane_doe`

## Configuration Examples

### Basic Configuration

Here's a minimal configuration to get you started:

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

### Complete Example

Here's a more complete example with multiple room types:

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
        "entityId": "light.living_room_main",
        "label": "Main Light"
      },
      {
        "type": "switch",
        "entityId": "switch.tv_power",
        "label": "TV Power"
      },
      {
        "type": "media",
        "entityId": "media_player.living_room_tv",
        "label": "TV"
      }
    ],
    "Bedroom": [
      {
        "type": "light",
        "entityId": "light.bedroom_lamp",
        "label": "Bedroom Lamp"
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
          "binary_sensor.back_door",
          "binary_sensor.garage_door"
        ],
        "labels": {
          "binary_sensor.front_door": "Front Door",
          "binary_sensor.back_door": "Back Door",
          "binary_sensor.garage_door": "Garage"
        },
        "deviceClass": "door",
        "showSummary": false
      }
    ]
  }
}
```

## Common Configurations

### 1. Lights Only

```json
{
  "people": [],
  "rooms": {
    "Lights": [
      { "type": "light", "entityId": "light.kitchen", "label": "Kitchen" },
      { "type": "light", "entityId": "light.living_room", "label": "Living Room" },
      { "type": "light", "entityId": "light.bedroom", "label": "Bedroom" }
    ]
  }
}
```

### 2. Room-by-Room Setup

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
    ],
    "Office": [
      { "type": "light", "entityId": "light.desk_lamp", "label": "Desk Lamp" },
      { "type": "media", "entityId": "media_player.speaker", "label": "Speaker" }
    ]
  }
}
```

### 3. Calendar Focus

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
        "daysAhead": 14,
        "showTitle": true
      },
      {
        "type": "calendar",
        "entityId": "calendar.family",
        "label": "Family Calendar",
        "maxEvents": 10,
        "daysAhead": 14,
        "showTitle": true
      }
    ]
  }
}
```

### 4. Security Dashboard

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
          "binary_sensor.side_door",
          "binary_sensor.garage_door",
          "binary_sensor.window_living_room",
          "binary_sensor.window_bedroom"
        ],
        "labels": {
          "binary_sensor.front_door": "Front Door",
          "binary_sensor.back_door": "Back Door",
          "binary_sensor.side_door": "Side Door",
          "binary_sensor.garage_door": "Garage",
          "binary_sensor.window_living_room": "Living Room Window",
          "binary_sensor.window_bedroom": "Bedroom Window"
        },
        "deviceClass": "door",
        "showSummary": true
      },
      {
        "type": "arm",
        "entityId": "alarm_control_panel.home_alarm",
        "label": "Arm Alarm"
      }
    ]
  }
}
```

### 5. Media Control Center

```json
{
  "people": [],
  "rooms": {
    "Media": [
      {
        "type": "media",
        "entityId": "media_player.living_room_tv",
        "label": "Living Room TV",
        "temperatureEntityId": "sensor.tv_temperature"
      },
      {
        "type": "media",
        "entityId": "media_player.bedroom_speaker",
        "label": "Bedroom Speaker"
      },
      {
        "type": "media",
        "entityId": "media_player.kitchen_echo",
        "label": "Kitchen Echo"
      }
    ]
  }
}
```

## Tile Type Reference

### Light
Controls a light with brightness adjustment.

```json
{
  "type": "light",
  "entityId": "light.bedroom",
  "label": "Bedroom Light"
}
```

### Switch
Controls a switch (smart plugs, outlets, etc.).

```json
{
  "type": "switch",
  "entityId": "switch.smart_plug",
  "label": "Smart Plug"
}
```

### Sensor
Displays sensor values.

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
Shows on/off or open/closed states.

```json
{
  "type": "binary_sensor",
  "entityId": "binary_sensor.door",
  "label": "Front Door",
  "deviceClass": "door"  // Options: "door", "window", "motion", "garage", "problem"
}
```

### Media Player
Controls media playback.

```json
{
  "type": "media",
  "entityId": "media_player.tv",
  "label": "TV",
  "temperatureEntityId": "sensor.tv_temp"  // Optional: shows device temperature
}
```

### Calendar
Displays calendar events.

```json
{
  "type": "calendar",
  "entityId": "calendar.my_calendar",
  "label": "Upcoming Events",
  "maxEvents": 5,        // Number of events to show (default: 5)
  "daysAhead": 7,        // How many days ahead to fetch (default: 7)
  "showTitle": true      // Show/hide calendar title (default: true)
}
```

### Status Grid
Shows multiple sensors in a grid layout.

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
  "deviceClass": "door",      // Default device class
  "showSummary": false,       // Show summary count
  "hideUnavailable": false,   // Hide unavailable sensors
  "sortByState": true          // Sort with active sensors first
}
```

### Arm (Security System)
Controls security system arming.

```json
{
  "type": "arm",
  "entityId": "alarm_control_panel.home_alarm",
  "label": "Arm Alarm"
}
```

### Automation
Triggers automations.

```json
{
  "type": "automation",
  "entityId": "automation.goodnight",
  "label": "Goodnight Scene"
}
```

## Troubleshooting

### Dashboard Keeps Asking for Login

**Solution:** Make sure you checked "Create a Long-Lived Access Token" during authentication. If you didn't:

1. Clear your browser's localStorage for the dashboard site
2. Reload the dashboard
3. When prompted, check "Create a Long-Lived Access Token"

### Entity Not Showing

1. **Check entity ID**: Verify the entity ID exists in Home Assistant
2. **Check permissions**: Ensure your HA user can access the entity
3. **Check config JSON**: Make sure your JSON is valid (use a JSON validator)
4. **Restart add-on**: After changing config, restart the add-on

### Calendar Not Loading

1. **Verify calendar entity**: Check that the calendar entity exists
2. **Check calendar has events**: The calendar needs to have events to display
3. **Verify permissions**: Your user must have access to the calendar

### Configuration Not Saving

1. **Check JSON validity**: Invalid JSON will be rejected
2. **Check add-on logs**: Look for error messages
3. **Restart add-on**: After saving config, restart the add-on

### Need Help?

- Check the [README.md](README.md) for general information
- See [CONFIGURATION.md](CONFIGURATION.md) for detailed configuration reference
- Review [SECURITY.md](SECURITY.md) for security information
