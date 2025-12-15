<script lang="ts">
	import { entities, connection } from "$lib/services/ha";
	import { callService } from "home-assistant-js-websocket";
	import { Power } from "lucide-svelte";

	export let entityId: string;
	export let label: string = "";

	// Reactive entity lookup (optional, for state display)
	$: entity = $entities[entityId];
	$: isOn = entity?.state === "on";

	function toggle() {
		if (!$connection) return;
		// Toggle the input_boolean which arms/disarms the automation
		callService($connection, "input_boolean", "toggle", { entity_id: entityId });
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class={isOn ? "tile on glass-panel" : "tile off glass-panel"} on:click={toggle}>
	<div class="icon">
		<Power size={32} />
	</div>
	<div class="name">{label || entity?.attributes.friendly_name || entityId}</div>
	<div class="state">{entity?.state || "Unknown"}</div>
</div>

<style>
	.tile {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		height: 100%;
		min-height: 120px;
		width: 100%;
		box-sizing: border-box;
	}
	.tile:hover {
		transform: translateY(-4px);
		background: rgba(255, 255, 255, 0.12);
		box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.2);
	}
	.tile.on {
		background: rgba(46, 204, 113, 0.2);
		border-color: rgba(46, 204, 113, 0.4);
	}
	.icon {
		margin-bottom: 0.5rem;
		color: rgba(255, 255, 255, 0.7);
		transition: all 0.2s ease;
	}
	.tile.on .icon {
		color: #2ecc71;
		filter: drop-shadow(0 0 8px rgba(46, 204, 113, 0.6));
	}
	.name {
		font-size: 0.9rem;
		font-weight: 500;
		text-align: center;
	}
	.state {
		font-size: 0.75rem;
		opacity: 0.7;
		margin-top: 0.25rem;
		text-transform: capitalize;
	}
</style>
