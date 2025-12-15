<script lang="ts">
	import { entities, connection, HASS_URL } from "$lib/services/ha";
	import { callService } from "home-assistant-js-websocket";
	import { Play, Pause, SkipBack, SkipForward, Power, Tv, Thermometer } from "lucide-svelte";

	export let entityId: string;
	export let label: string;
	export let temperatureEntityId: string | undefined = undefined;

	$: entity = $entities[entityId];
	$: state = entity?.state;
	$: isPlaying = state === "playing";
	$: attributes = entity?.attributes || {};

	$: title = attributes.media_title || attributes.source || "No Media";
	$: artist = attributes.media_artist || attributes.media_series_title || "";

	$: picturePath = attributes.entity_picture;
	$: artwork = picturePath ? new URL(picturePath, HASS_URL).href : null;

	$: temperatureEntity = temperatureEntityId ? $entities[temperatureEntityId] : null;
	$: temperature = temperatureEntity
		? `${temperatureEntity.state}${temperatureEntity.attributes.unit_of_measurement || "°C"}`
		: null;

	function togglePlay(e: Event) {
		e.stopPropagation();
		if (!$connection) return;
		callService($connection, "media_player", "media_play_pause", {
			entity_id: entityId,
		});
	}

	function nextTrack(e: Event) {
		e.stopPropagation();
		if (!$connection) return;
		callService($connection, "media_player", "media_next_track", {
			entity_id: entityId,
		});
	}

	function prevTrack(e: Event) {
		e.stopPropagation();
		if (!$connection) return;
		callService($connection, "media_player", "media_previous_track", {
			entity_id: entityId,
		});
	}

	function togglePower(e: Event) {
		e.stopPropagation();
		if (!$connection) return;
		callService($connection, "media_player", "toggle", {
			entity_id: entityId,
		});
	}
</script>

<div class="tile {state} glass-panel" style:--bg-image={artwork ? `url('${artwork}')` : "none"}>
	<div class="bg-overlay"></div>
	<div class="content">
		<div class="header">
			<div class="header-left">
				<span class="icon">
					{#if state === "playing"}
						<Play size={16} fill="currentColor" />
					{:else if state === "paused"}
						<Pause size={16} fill="currentColor" />
					{:else}
						<Tv size={16} />
					{/if}
				</span>
				<span class="label">{label || attributes.friendly_name || "Media"}</span>
			</div>
			<div class="header-right">
				<button class="btn-icon power" on:click={togglePower}>
					<Power size={20} />
				</button>
			</div>
		</div>

		<div class="info">
			<div class="text-info">
				<div class="title">{title}</div>
				{#if artist}
					<div class="artist">{artist}</div>
				{/if}
			</div>

			<div class="controls">
				{#if temperature}
					<div class="temperature">
						<Thermometer size={14} class="temp-icon" />
						{temperature}
					</div>
				{/if}
				<button class="btn-control" on:click={prevTrack}>
					<SkipBack size={24} fill="currentColor" />
				</button>
				<button class="btn-control play-pause" on:click={togglePlay}>
					{#if isPlaying}
						<Pause size={32} fill="currentColor" />
					{:else}
						<Play size={32} fill="currentColor" />
					{/if}
				</button>
				<button class="btn-control" on:click={nextTrack}>
					<SkipForward size={24} fill="currentColor" />
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.tile {
		height: 100%; /* Fluid height to fill grid cell */
		min-height: 140px;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	/* Background artwork with blur opacity */
	.tile::before {
		content: "";
		position: absolute;
		inset: 0;
		background-image: var(--bg-image);
		background-size: cover;
		background-position: center;
		opacity: 0.3;
		filter: blur(2px) grayscale(50%);
		transition: all 0.5s ease;
	}

	.tile.playing::before {
		opacity: 0.5;
		filter: blur(0px) grayscale(0%);
	}

	.bg-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8));
		z-index: 1;
	}

	.content {
		position: relative;
		z-index: 2;
		height: 100%;
		padding: 0.75rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-sizing: border-box;
		flex-grow: 1;
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.85rem;
		opacity: 0.9;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.temperature {
		font-size: 0.8rem;
		background: rgba(0, 0, 0, 0.4);
		padding: 0.2rem 0.5rem;
		border-radius: 99rem;
		width: max-content;
		margin: 0.5rem 0;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.temp-icon {
		opacity: 0.8;
	}

	.btn-icon {
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: background 0.2s;
	}

	.btn-icon:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.power {
		color: #e74c3c;
	}

	.info {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.title {
		font-weight: 600;
		font-size: 0.95rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
	}

	.artist {
		font-size: 0.75rem;
		opacity: 0.8;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.25rem;
	}

	.btn-control {
		background: none;
		border: none;
		color: white;
		border-radius: 50%;
		width: 1.6rem;
		height: 1.6rem;
		padding: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		font-size: 1rem;
		transition: all 0.2s;
	}

	.btn-control:hover {
		background: none;
		transform: scale(1.1);
	}

	/* .play-pause {
		width: 40px;
		height: 40px;
		font-size: 1rem;
		background: rgba(255, 255, 255, 0.3);
	} */
</style>
