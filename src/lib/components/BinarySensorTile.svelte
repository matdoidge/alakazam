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
	} from "lucide-svelte";

	export let entityId: string;
	export let label: string;
	export let deviceClass: "door" | "window" | "motion" | "garage" | "problem" = "door";

	$: entity = $entities[entityId];
	$: state = entity?.state;
	$: isOn = state === "on";

	// Mapping based on device class
	$: stateLabel = isOn ? getOnLabel(deviceClass) : getOffLabel(deviceClass);
	$: IconComponent = isOn ? getOnIcon(deviceClass) : getOffIcon(deviceClass);

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
				return AppWindow; // Or Rect
			case "motion":
				return Footprints;
			case "garage":
				return Warehouse; // Maps well to garage generic
			default:
				return AlertTriangle;
		}
	}

	function getOffIcon(cls: string) {
		switch (cls) {
			case "door":
				return DoorClosed;
			case "window":
				return AppWindow; // Square/closed window look? Just keep AppWindow for now
			case "motion":
				return CheckCircle2; // "Clear"
			case "garage":
				return Warehouse;
			default:
				return CheckCircle2;
		}
	}
</script>

<div class="tile {isOn ? 'active' : 'inactive'} glass-panel">
	<div class="header">{label || entity?.attributes.friendly_name || entityId}</div>
	<div class="content">
		<span class="icon">
			<svelte:component this={IconComponent} size={24} />
		</span>
		<span class="state">{stateLabel}</span>
	</div>
</div>

<style>
	.tile {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		min-height: 120px;
		width: 100%;
		box-sizing: border-box;
	}

	.tile.active {
		background: rgba(231, 76, 60, 0.2); /* Red tint for open/alert */
		border-color: rgba(231, 76, 60, 0.4);
	}

	.header {
		font-size: 0.85rem;
		opacity: 0.8;
		margin-bottom: 0.5rem;
	}

	.content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.icon {
		/* font-size removed */
		display: flex;
		align-items: center;
	}

	.state {
		font-size: 1.2rem;
		font-weight: 600;
	}
</style>
