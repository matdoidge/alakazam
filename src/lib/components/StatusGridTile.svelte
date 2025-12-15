<script lang="ts">
	import { entities } from "$lib/services/ha";
	import {
		DoorOpen,
		DoorClosed,
		AppWindow,
		Footprints,
		Warehouse,
		AlertTriangle,
		CheckCircle2,
		XCircle,
		Maximize,
		Square,
		HelpCircle,
	} from "lucide-svelte";

	/** Array of entity IDs to display */
	export let entityIds: string[] = [];

	/** Optional mapping of entityId → friendly label */
	export let labels: Record<string, string> = {};

	/** Default device class for all entities (can be overridden per entity) */
	export let deviceClass: "door" | "window" | "motion" | "garage" | "problem" | string = "door";

	/** Optional mapping of entityId → device class (overrides default) */
	export let deviceClasses: Record<string, string> = {};

	/** Optional title/header for the status grid */
	export let title: string = "";

	/** Whether to show a summary count (e.g., "3 doors, 1 open") */
	export let showSummary: boolean = false;

	/** Whether to hide unavailable entities */
	export let hideUnavailable: boolean = false;

	/** Whether to sort entities with active/open states first */
	export let sortByState: boolean = true;

	// Helper functions (reused from BinarySensorTile pattern)
	function getOnLabel(cls: string) {
		switch (cls) {
			case "door":
				return "Open";
			case "window":
				return "Open";
			case "motion":
				return "Detected";
			case "garage":
				return "Open";
			case "problem":
				return "Problem";
			default:
				return "On";
		}
	}

	function getOffLabel(cls: string) {
		switch (cls) {
			case "door":
				return "Closed";
			case "window":
				return "Closed";
			case "motion":
				return "Clear";
			case "garage":
				return "Closed";
			case "problem":
				return "OK";
			default:
				return "Off";
		}
	}

	function getOnIcon(cls: string) {
		switch (cls) {
			case "door":
				return DoorOpen;
			case "window":
				return AppWindow;
			case "motion":
				return Footprints;
			case "garage":
				return Warehouse;
			default:
				return AlertTriangle;
		}
	}

	function getOffIcon(cls: string) {
		switch (cls) {
			case "door":
				return DoorClosed;
			case "window":
				return AppWindow;
			case "motion":
				return CheckCircle2;
			case "garage":
				return Warehouse;
			default:
				return CheckCircle2;
		}
	}

	// Helper to get state label for unavailable/unknown states
	function getStateLabel(state: string | undefined, deviceClass: string, isOn: boolean): string {
		if (!state || state === "unavailable" || state === "unknown") {
			return state === "unavailable" ? "Unavailable" : "Unknown";
		}
		return isOn ? getOnLabel(deviceClass) : getOffLabel(deviceClass);
	}

	// Helper to get icon for unavailable/unknown states
	function getStateIcon(state: string | undefined, deviceClass: string, isOn: boolean) {
		if (!state || state === "unavailable" || state === "unknown") {
			return HelpCircle;
		}
		return isOn ? getOnIcon(deviceClass) : getOffIcon(deviceClass);
	}

	// Reactive lookup of the entity objects with their device classes
	$: entityStates = entityIds
		.map((id) => {
			const entity = $entities[id];
			const entityDeviceClass = deviceClasses[id] ?? entity?.attributes?.device_class ?? deviceClass;
			const state = entity?.state;
			const isOn = state === "on";
			const isUnavailable = !state || state === "unavailable" || state === "unknown";
			
			// Filter out unavailable if hideUnavailable is true
			if (hideUnavailable && isUnavailable) {
				return null;
			}
			
			return {
				id,
				entity,
				label: labels[id] ?? entity?.attributes?.friendly_name ?? id,
				deviceClass: entityDeviceClass,
				state,
				isOn,
				isUnavailable,
				stateLabel: getStateLabel(state, entityDeviceClass, isOn),
				IconComponent: getStateIcon(state, entityDeviceClass, isOn),
			};
		})
		.filter((item): item is NonNullable<typeof item> => item !== null)
		.sort((a, b) => {
			// Sort by state if enabled: active/unavailable first, then inactive
			if (sortByState) {
				if (a.isUnavailable && !b.isUnavailable) return -1;
				if (!a.isUnavailable && b.isUnavailable) return 1;
				if (a.isOn && !b.isOn) return -1;
				if (!a.isOn && b.isOn) return 1;
			}
			return 0;
		});

	// Calculate summary stats
	$: summary = showSummary
		? (() => {
				const total = entityStates.length;
				const active = entityStates.filter((e) => e.isOn).length;
				const unavailable = entityStates.filter((e) => e.isUnavailable).length;
				return { total, active, unavailable };
			})()
		: null;
</script>

<div class="status-grid-container">
	{#if title || summary}
		<div class="header">
			{#if title}
				<h3 class="title">{title}</h3>
			{/if}
			{#if summary}
				<div class="summary">
					{summary.total} {summary.total === 1 ? "sensor" : "sensors"}
					{#if summary.active > 0}
						, <span class="active-count">{summary.active} active</span>
					{/if}
					{#if summary.unavailable > 0}
						, <span class="unavailable-count">{summary.unavailable} unavailable</span>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
	{#if entityStates.length === 0}
		<div class="empty-state">
			<p>No sensors available</p>
		</div>
	{:else}
		<div class="status-grid">
			{#each entityStates as { id, entity, label, isOn, isUnavailable, stateLabel, IconComponent }}
				<div
					class="tile glass-panel {isUnavailable
						? 'unavailable'
						: isOn
							? 'active'
							: 'inactive'}"
					title="{label}: {stateLabel}"
				>
					<div class="icon">
						<svelte:component this={IconComponent} size={24} />
					</div>
					<div class="name">{label}</div>
					<div class="state">{stateLabel}</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.status-grid-container {
		width: 100%;
	}

	.header {
		margin-bottom: 1rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.title {
		font-size: 0.9rem;
		font-weight: 600;
		opacity: 0.8;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.summary {
		font-size: 0.8rem;
		opacity: 0.6;
	}

	.active-count {
		color: rgba(231, 76, 60, 0.9);
		font-weight: 500;
	}

	.unavailable-count {
		color: rgba(149, 165, 166, 0.9);
		font-weight: 500;
	}

	.empty-state {
		padding: 2rem;
		text-align: center;
		opacity: 0.5;
		font-size: 0.9rem;
	}

	.status-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.tile {
		padding: 0.75rem;
		min-width: 120px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		cursor: default;
	}

	.tile:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.tile.active {
		background: rgba(231, 76, 60, 0.2); /* Red tint for open/alert */
		border-color: rgba(231, 76, 60, 0.4);
	}

	.tile.inactive {
		background: rgba(255, 255, 255, 0.05);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.tile.unavailable {
		background: rgba(149, 165, 166, 0.15);
		border-color: rgba(149, 165, 166, 0.3);
		opacity: 0.6;
	}

	.icon {
		margin-bottom: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.name {
		font-size: 0.85rem;
		font-weight: 500;
		margin-top: 0.25rem;
	}

	.state {
		font-size: 0.75rem;
		opacity: 0.7;
		margin-top: 0.125rem;
	}
</style>
