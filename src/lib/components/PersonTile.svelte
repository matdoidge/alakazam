<script lang="ts">
	import { entities, getEntityPictureUrl } from "$lib/services/ha";
	import { House, Tent, User, Battery } from "lucide-svelte";

	export let entityId: string;
	export let label: string;
	export let batteryEntityId: string | undefined = undefined;

	$: entity = $entities[entityId];
	$: state = entity?.state;
	$: isHome = state === "home";
	$: picturePath = entity?.attributes.entity_picture;
	$: picture = getEntityPictureUrl(picturePath);

	$: batteryEntity = batteryEntityId ? $entities[batteryEntityId] : null;
	$: batteryLevel = (() => {
		if (!batteryEntity || !batteryEntity.state) return null;
		if (batteryEntity.state === "unavailable" || batteryEntity.state === "unknown") return null;
		const parsed = parseFloat(batteryEntity.state);
		return isNaN(parsed) ? null : parsed;
	})();
	$: batteryUnit = batteryEntity?.attributes.unit_of_measurement || "%";

	// Debug logging
	$: if (batteryEntityId) {
		if (!batteryEntity) {
			console.warn(
				`Battery entity "${batteryEntityId}" not found in entities. Available entities:`,
				Object.keys($entities).filter((k) => k.includes("battery") || k.includes("phone"))
			);
		} else {
			console.log(`Battery entity ${batteryEntityId}:`, {
				state: batteryEntity.state,
				level: batteryLevel,
				unit: batteryUnit,
			});
		}
	}
</script>

<div class="tile {isHome ? 'home' : 'away'} glass-panel">
	<div class="icon-area">
		{#if picture}
			<img src={picture} alt={label} class="avatar" />
		{:else}
			<span class="icon">
				{#if isHome}
					<House size={24} />
				{:else}
					<Tent size={24} />
				{/if}
			</span>
		{/if}
	</div>
	<div class="info">
		<div class="name">{label || entity?.attributes.friendly_name || entityId}</div>
		<div class="state">{state || "Unknown"}</div>
		{#if batteryLevel !== null}
			<div class="battery">
				<span class="battery-icon" class:low={batteryLevel < 20}>
					<Battery size={14} />
				</span>
				<span>{Math.round(batteryLevel)}{batteryUnit}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.tile {
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border-radius: 20px;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		gap: 1rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.15);
		height: 100%;
		min-height: 80px;
		width: fit-content;
		box-sizing: border-box;
		transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
	}

	.tile.home {
		background: rgba(46, 204, 113, 0.15);
		border-color: rgba(46, 204, 113, 0.3);
	}

	.tile.away {
		opacity: 0.7;
	}

	.icon-area {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		flex-shrink: 0;
	}

	.avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.info {
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.name {
		font-size: 0.95rem;
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.state {
		font-size: 0.8rem;
		opacity: 0.8;
		text-transform: capitalize;
	}

	.battery {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		font-size: 0.75rem;
		opacity: 0.7;
		margin-top: 0.25rem;
	}

	.battery-icon {
		opacity: 0.8;
	}

	.battery-icon.low {
		color: #e74c3c;
		opacity: 1;
	}
</style>
