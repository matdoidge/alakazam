<script lang="ts">
	import { onMount } from "svelte";
	import { connectToHA, connected, connectionError, entities, connection } from "$lib/services/ha";
	import { callService } from "home-assistant-js-websocket";
	import LightToggle from "$lib/components/LightToggle.svelte";
	import SensorTile from "$lib/components/SensorTile.svelte";
	import BinarySensorTile from "$lib/components/BinarySensorTile.svelte";
	import SwitchTile from "$lib/components/SwitchTile.svelte";
	import PersonTile from "$lib/components/PersonTile.svelte";
	import MediaTile from "$lib/components/MediaTile.svelte";
	import ArmTile from "$lib/components/ArmTile.svelte";
	import AutomationTile from "$lib/components/AutomationTile.svelte";
	import { LightbulbOff, Moon, Sun } from "lucide-svelte";
	import StatusGridTile from "$lib/components/StatusGridTile.svelte";
	import CalendarTile from "$lib/components/CalendarTile.svelte";
	import { loadConfig, getDefaultConfig, type DashboardConfig } from "$lib/config";

	let now = $state(new Date());
	let timeString = $derived(
		now.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: true,
		})
	);
	let dateString = $derived(
		now.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
		})
	);

	let darkMode = $state(false);
	let people = $state<DashboardConfig["people"]>([]);
	let rooms = $state<DashboardConfig["rooms"]>({});

	function toggleDarkMode() {
		darkMode = !darkMode;
		if (typeof window !== "undefined") {
			localStorage.setItem("darkMode", darkMode.toString());
			document.documentElement.classList.toggle("dark", darkMode);
		}
	}

	onMount(() => {
		console.log("Alakazam Dashboard: Initializing...");
		console.log("Current URL:", typeof window !== "undefined" ? window.location.href : "N/A");

		// Load configuration (with fallback to defaults)
		loadConfig()
			.then((config) => {
				people = config.people;
				rooms = config.rooms;
				console.log("Configuration loaded:", {
					people: people.length,
					rooms: Object.keys(rooms).length,
				});
			})
			.catch((error) => {
				console.error("Failed to load config, using defaults:", error);
				const defaults = getDefaultConfig();
				people = defaults.people;
				rooms = defaults.rooms;
			});

		try {
			connectToHA();
		} catch (error) {
			console.error("Error connecting to HA:", error);
		}

		const interval = setInterval(() => {
			now = new Date();
		}, 1000);

		// Load dark mode preference
		if (typeof window !== "undefined") {
			const savedDarkMode = localStorage.getItem("darkMode") === "true";
			darkMode = savedDarkMode;
			if (savedDarkMode) {
				document.documentElement.classList.add("dark");
			}
		}

		return () => clearInterval(interval);
	});

	function turnOffEverything() {
		if (!$connection) return;
		const entitiesOn = Object.keys($entities).filter(
			(id) => (id.startsWith("light.") || id.startsWith("switch.")) && $entities[id].state === "on"
		);

		if (entitiesOn.length > 0) {
			callService($connection, "homeassistant", "turn_off", {
				entity_id: entitiesOn,
			});
		}
	}
</script>

<div class="dashboard-container">
	<header>
		<div class="header-left">
			<div class="clock">
				<span class="time">{timeString}</span>
				<span class="date">{dateString}</span>
			</div>
			<div class="status-container">
				{#if $connectionError}
					<div class="status error" title={$connectionError}>{$connectionError}</div>
				{:else}
					<div class="status" class:connected={$connected}>
						{$connected ? "Connected" : "Connecting..."}
					</div>
				{/if}
				<button
					class="master-switch glass-panel"
					onclick={turnOffEverything}
					title="Turn Off All Lights & Plugs"
				>
					<LightbulbOff size={20} />
					<span>All Off</span>
				</button>
				<button
					class="dark-mode-toggle glass-panel"
					onclick={toggleDarkMode}
					title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
				>
					{#if darkMode}
						<Sun size={20} />
					{:else}
						<Moon size={20} />
					{/if}
				</button>
			</div>
		</div>
		{#if people.length > 0}
			<div>
				<div class="people">
					<div class="people-grid">
						{#each people as person}
							<PersonTile
								entityId={person.entityId}
								label={person.label}
								batteryEntityId={(person as any).batteryEntityId}
							/>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</header>

	<main>
		<main>
			<!-- ... main content (unchanged) ... -->
			<!-- Loop through each room -->
			{#each Object.entries(rooms) as [roomName, tiles]}
				<section class="section">
					<h2>{roomName}</h2>
					<div class="grid">
						{#each tiles as tile}
							<!-- Cast to 'any' for simple access to optional props like unit/deviceClass without huge union checks -->
							{#if tile.type === "light"}
								<LightToggle entityId={(tile as any).entityId} label={(tile as any).label} />
							{:else if tile.type === "sensor"}
								<SensorTile
									entityId={(tile as any).entityId}
									label={(tile as any).label}
									unit={(tile as any).unit}
									format={(tile as any).format}
								/>
							{:else if tile.type === "binary_sensor"}
								<BinarySensorTile
									entityId={(tile as any).entityId}
									label={(tile as any).label}
									deviceClass={(tile as any).deviceClass}
								/>
							{:else if tile.type === "switch"}
								<SwitchTile entityId={(tile as any).entityId} label={(tile as any).label} />
							{:else if tile.type === "arm"}
								<ArmTile entityId={(tile as any).entityId} label={(tile as any).label} />
							{:else if tile.type === "automation"}
								<AutomationTile entityId={(tile as any).entityId} label={(tile as any).label} />
							{:else if tile.type === "media"}
								<MediaTile
									entityId={(tile as any).entityId}
									label={(tile as any).label}
									temperatureEntityId={(tile as any).temperatureEntityId}
								/>
							{:else if tile.type === "statusGrid"}
								<div class="status-grid-wrapper">
									<StatusGridTile
										entityIds={(tile as any).entityIds ?? []}
										labels={(tile as any).labels ?? {}}
										deviceClass={(tile as any).deviceClass ?? "door"}
										deviceClasses={(tile as any).deviceClasses ?? {}}
										title={(tile as any).title ?? ""}
										showSummary={(tile as any).showSummary ?? false}
										hideUnavailable={(tile as any).hideUnavailable ?? false}
										sortByState={(tile as any).sortByState ?? true}
									/>
								</div>
							{:else if tile.type === "calendar"}
								<div class="calendar-tile-wrapper">
									<CalendarTile
										entityId={(tile as any).entityId}
										label={(tile as any).label ?? ""}
										maxEvents={(tile as any).maxEvents ?? 5}
										daysAhead={(tile as any).daysAhead ?? 7}
										showTitle={(tile as any).showTitle !== undefined
											? (tile as any).showTitle
											: true}
									/>
								</div>
							{/if}
						{/each}
					</div>
				</section>
			{/each}
		</main>
	</main>
</div>

<style>
	/* ... existing styles ... */
	.debug-list {
		font-family: monospace;
		font-size: 0.8rem;
		opacity: 0.7;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		background: rgba(0, 0, 0, 0.3);
		padding: 1rem;
		border-radius: 8px;
	}

	.dashboard-container {
		padding: 2rem;
		max-width: 1200px;
		margin: 0 auto;
	}

	header {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 2rem;
		padding: 1rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	@media (min-width: 1024px) {
		/* Styles for Landscape Tablet, Desktop, etc. */
	}

	.header-left {
		display: flex;
		flex-direction: row;
		gap: 1.2rem;
		justify-content: center;
		align-items: center;
	}

	h1 {
		font-size: 1.5rem;
		margin: 0;
		font-weight: 700;
		background: linear-gradient(90deg, #ff8a00, #e52e71);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		letter-spacing: -0.5px;
	}

	.clock {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		align-items: baseline;
		line-height: 1;
	}

	.time {
		font-size: 2.5rem;
		font-weight: 500;
		opacity: 0.9;
		align-self: center;
	}

	.date {
		font-size: 0.9rem;
		opacity: 0.6;
		font-weight: 400;
		align-self: center;
	}

	.status {
		font-size: 0.8rem;
		padding: 0.6rem 0.75rem;
		border-radius: 20px;
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.5);
	}

	.status-container {
		display: flex;
		/* justify-self: flex-start; */
		/* align-self: flex-start; */
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
	}

	.status.connected {
		background: rgba(46, 204, 113, 0.2);
		color: #2ecc71;
	}

	.status.error {
		background: rgba(231, 76, 60, 0.2);
		color: #e74c3c;
	}

	.master-switch,
	.dark-mode-toggle {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.05); /* Gentle background */
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 99rem;
		color: rgba(255, 255, 255, 0.8);
		cursor: pointer;
		transition: all 0.2s ease;
		/* margin-top: 0.5rem; */
	}

	.master-switch:hover,
	.dark-mode-toggle:hover {
		background: rgba(255, 255, 255, 0.15);
		transform: translateY(-2px);
	}

	.master-switch:active,
	.dark-mode-toggle:active {
		transform: translateY(0);
	}

	.dark-mode-toggle {
		padding: 0.5rem;
		min-width: 2.5rem;
		justify-content: center;
	}

	.section {
		margin-bottom: 2.5rem;
	}

	h2 {
		font-size: 1.1rem;
		font-weight: 500;
		opacity: 0.6;
		margin: 0 0 1rem 0;
		text-transform: uppercase;
		letter-spacing: 1.5px;
	}

	.people-grid {
		display: flex;
		width: fit-content;
		flex-direction: row;
		gap: 1rem;
		flex-wrap: nowrap;
	}

	.people-grid > .tile {
		flex: 1 1 0;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
		gap: 1.5rem;
	}

	.status-grid-wrapper {
		grid-column: 1 / -1; /* Span full width */
	}

	.calendar-tile-wrapper {
		grid-column: 1 / -1; /* Span full width */
	}

	@media (min-width: 768px) {
		.grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 2rem;
		}
	}
</style>
