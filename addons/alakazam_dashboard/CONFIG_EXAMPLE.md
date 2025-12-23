# Dashboard Configuration Example

Copy this example into the `dashboard_config` field in the add-on Configuration tab:

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
    "Bedroom": [
      {
        "type": "light",
        "entityId": "light.bedroom",
        "label": "Bedroom Light"
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

## Finding Your Entity IDs

1. Go to **Settings** → **Devices & Services** → **Entities**
2. Search for your device
3. Copy the entity ID (e.g., `light.bedroom_lamp`)

For calendars:
- Go to **Settings** → **Devices & Services** → **CalDAV** (or your calendar integration)
- Find your calendar and copy its entity ID (e.g., `calendar.my_calendar`)

## Tile Types

- **light**: `{ "type": "light", "entityId": "light.bedroom", "label": "Bedroom Light" }`
- **switch**: `{ "type": "switch", "entityId": "switch.smart_plug", "label": "Smart Plug" }`
- **sensor**: `{ "type": "sensor", "entityId": "sensor.temperature", "label": "Temperature", "unit": "°C" }`
- **binary_sensor**: `{ "type": "binary_sensor", "entityId": "binary_sensor.door", "label": "Front Door", "deviceClass": "door" }`
- **media**: `{ "type": "media", "entityId": "media_player.tv", "label": "TV" }`
- **calendar**: `{ "type": "calendar", "entityId": "calendar.my_calendar", "label": "Events", "maxEvents": 5, "daysAhead": 7 }`
- **statusGrid**: `{ "type": "statusGrid", "entityIds": ["binary_sensor.door1", "binary_sensor.door2"], "deviceClass": "door" }`
- **arm**: `{ "type": "arm", "entityId": "input_boolean.security", "label": "Arm Security" }`
- **automation**: `{ "type": "automation", "entityId": "automation.goodnight", "label": "Goodnight Scene" }`

See [CONFIGURATION.md](../../CONFIGURATION.md) for full documentation.

