// Default configuration (your hardcoded setup)
const DEFAULT_CONFIG = {
	people: [
		{
			entityId: "person.artfuldoidger",
			label: "Mat",
			batteryEntityId: "sensor.mats_iphone_battery_level",
		},
		{
			entityId: "person.jessi",
			label: "Jess",
			batteryEntityId: "sensor.jessi_battery_level",
		},
	],
	rooms: {
		Security: [
			{
				type: "statusGrid",
				entityIds: ["binary_sensor.frontdoor_contact_sensor_contact"],
				labels: {
					"binary_sensor.frontdoor_contact_sensor_contact": "Front Door",
				},
				deviceClass: "door",
				showSummary: false,
			},
			{
				type: "arm",
				entityId: "input_boolean.nighttime_door_warning",
				label: "Arm Door Sensors",
			},
		],
		Calendar: [
			{
				type: "calendar",
				entityId: "calendar.mat_and_jessi",
				label: "Upcoming Events",
				maxEvents: 5,
				daysAhead: 1,
				showTitle: false,
			},
		],
		"Living Room": [
			{ type: "media", entityId: "media_player.living_room_tv", label: "TV" },
			{ type: "switch", entityId: "switch.innr_smart_plug_1", label: "Xmas TreeSmart Plug" },
		],
		"Master Bedroom": [
			{ type: "light", entityId: "light.bedroom_lamp", label: "Mat Bedroom Lamp" },
			{ type: "light", entityId: "light.mat_and_jess_light", label: "Mat & Jess Light Strip" },
			{ type: "switch", entityId: "switch.0x0017880108e74ea6", label: "Mat & Jess Smart Plug" },
			{ type: "media", entityId: "media_player.main_bedroom", label: "Apple TV" },
		],
		"Kids' Rooms": [
			{ type: "light", entityId: "light.ellies_room", label: "Ellie's Light Bar" },
			{
				type: "media",
				entityId: "media_player.ellie_s_daddy_s_house",
				label: "Ellie's Yoto",
				temperatureEntityId: "sensor.ellie_s_daddy_s_house_temperature",
			},
			{ type: "light", entityId: "light.poppys_light_strip_2", label: "Poppy's Light" },
			{
				type: "media",
				entityId: "media_player.poppy_s_yoto",
				label: "Poppy's Yoto",
				temperatureEntityId: "sensor.poppy_s_yoto_temperature",
			},
			{ type: "light", entityId: "light.bens_bedside_lamp", label: "Ben's Lamp" },
		],
		Hallway: [
			{
				type: "binary_sensor",
				entityId: "binary_sensor.frontdoor_contact_sensor_contact",
				label: "Front Door",
				deviceClass: "door",
			},
			{ type: "light", entityId: "light.hallway", label: "Hallway Light" },
		],
		Network: [
			{ type: "sensor", entityId: "sensor.ucg_ultra_state", label: "UCG Ultra State" },
			{ type: "sensor", entityId: "sensor.atom", label: "Atom Wifi", unit: "Clients" },
			{ type: "sensor", entityId: "sensor.cerebro", label: "Cerebro Wifi", unit: "Clients" },
			{
				type: "sensor",
				entityId: "sensor.ucg_ultra_ucg_ultra_cpu_temperature",
				label: "UCG Ultra CPU Temp",
				unit: "°C",
			},
		],
		"Raspberry Pi Server": [
			{
				type: "sensor",
				entityId: "sensor.system_monitor_last_boot",
				label: "Last Boot",
				format: "date",
			},
			{ type: "sensor", entityId: "sensor.system_monitor_disk_use", label: "Disk Use", unit: "%" },
			{
				type: "sensor",
				entityId: "sensor.system_monitor_disk_free",
				label: "Disk Free",
				unit: "GB",
			},
			{
				type: "sensor",
				entityId: "sensor.system_monitor_processor_temperature",
				label: "Processor Temp",
				unit: "°C",
			},
		],
	},
};

export interface DashboardConfig {
	people: Array<{
		entityId: string;
		label: string;
		batteryEntityId?: string;
	}>;
	rooms: Record<
		string,
		Array<{
			type: string;
			entityId?: string;
			entityIds?: string[];
			label?: string;
			[key: string]: any;
		}>
	>;
}

let cachedConfig: DashboardConfig | null = null;

/**
 * Load dashboard configuration
 * Tries to load from config.json, falls back to defaults
 */
export async function loadConfig(): Promise<DashboardConfig> {
	if (cachedConfig) {
		return cachedConfig;
	}

	try {
		// Try to load user config from /config.json
		const response = await fetch("/config.json");
		if (response.ok) {
			const userConfig = await response.json();
			console.log("Loaded user config from /config.json");
			// Merge with defaults (user config overrides defaults)
			cachedConfig = {
				people: userConfig.people || DEFAULT_CONFIG.people,
				rooms: { ...DEFAULT_CONFIG.rooms, ...userConfig.rooms },
			};
			return cachedConfig;
		}
	} catch (error) {
		console.log("No user config found, using defaults:", error);
	}

	// Fall back to defaults
	cachedConfig = DEFAULT_CONFIG;
	return cachedConfig;
}

/**
 * Get default config (for reference/editing)
 */
export function getDefaultConfig(): DashboardConfig {
	return DEFAULT_CONFIG;
}
