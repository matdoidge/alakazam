<script lang="ts">
	import { entities } from "$lib/services/ha";

	export let entityId: string;
	export let label: string;
	export let format: string = "";
	export let unit: string = "";

	$: entity = $entities[entityId];
	$: rawValue = entity?.state;
	$: unitOfMeasurement = unit || entity?.attributes.unit_of_measurement || "";

	$: value =
		format === "date" && rawValue
			? new Date(rawValue).toLocaleString("en-US", {
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
				})
			: rawValue;
</script>

<div class="tile sensor glass-panel">
	<div class="header">{label || entity?.attributes.friendly_name || entityId}</div>
	<div class="value">
		{value || "--"}
		<span class="unit">{unitOfMeasurement}</span>
	</div>
</div>

<style>
	.tile {
		/* Glass styles handled by .glass-panel global class */
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 100%;
		min-height: 120px;
		width: 100%;
		box-sizing: border-box;
	}

	.header {
		font-size: 0.85rem;
		opacity: 0.8;
		margin-bottom: 0.5rem;
	}

	.value {
		font-size: 1.8rem;
		font-weight: 600;
	}

	.unit {
		font-size: 1rem;
		opacity: 0.6;
		margin-left: 2px;
	}
</style>
