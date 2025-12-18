<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { connection, connected } from "$lib/services/ha";
	import { getCalendarEvents } from "$lib/services/ha";
	import { Calendar, Clock, MapPin } from "lucide-svelte";

	export let entityId: string;
	export let label: string = "";
	export let maxEvents: number = 5;
	export let daysAhead: number = 7;
	export let showTitle: boolean = true;

	let events: any[] = [];
	let loading = true;
	let error: string | null = null;
	let refreshInterval: ReturnType<typeof setInterval> | null = null;
	let hasFetched = false;

	// Reactive: fetch events when connection becomes available (only once)
	$: if ($connected && $connection && !hasFetched) {
		hasFetched = true;
		fetchEvents();
	}

	async function fetchEvents() {
		// Calendar API works via REST, so we don't strictly need the websocket connection
		// But we'll wait a bit for connection to establish if it's not ready yet
		if (!$connected) {
			// Wait a moment for connection to establish
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}

		try {
			loading = true;
			error = null;
			const startDate = new Date();
			// Set start to beginning of today to include all of today's events
			startDate.setHours(0, 0, 0, 0);

			// Set end to end of the target day (23:59:59) to include all events on that day
			const endDate = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
			endDate.setHours(23, 59, 59, 999);

			console.log("Calendar date range:", {
				start: startDate.toISOString(),
				end: endDate.toISOString(),
				daysAhead,
			});

			const fetchedEvents = await getCalendarEvents(entityId, startDate, endDate);

			console.log("Fetched events:", fetchedEvents);
			console.log("Number of events:", fetchedEvents.length);
			if (fetchedEvents.length > 0) {
				console.log("First event:", fetchedEvents[0]);
			}

			// Sort by start time and limit
			events = fetchedEvents
				.sort((a, b) => {
					const aStart = new Date(a.start?.dateTime || a.start?.date || 0);
					const bStart = new Date(b.start?.dateTime || b.start?.date || 0);
					return aStart.getTime() - bStart.getTime();
				})
				.slice(0, maxEvents);

			console.log("Processed events:", events.length);
		} catch (err: any) {
			const errorMessage = err.message || "Failed to load events";
			error = errorMessage;
			console.error("Calendar fetch error:", err);
			console.error("Entity ID:", entityId);
			console.error("Error details:", {
				message: err.message,
				stack: err.stack,
				name: err.name,
			});
			events = [];
		} finally {
			loading = false;
		}
	}

	function isAllDayEvent(event: any): boolean {
		// Try multiple possible property names
		const start =
			event.start?.date ||
			event.start?.dateTime ||
			event.start_time ||
			event.dtstart ||
			event.start;

		if (!start) return false;

		// All-day events typically have just a date (no time component)
		// Check if it's a date-only string (YYYY-MM-DD format)
		return (
			typeof start === "string" &&
			!start.includes("T") &&
			!start.includes(" ") &&
			!!start.match(/^\d{4}-\d{2}-\d{2}$/)
		);
	}

	function formatEventDate(event: any): string {
		// Try multiple possible property names for the start date
		const start =
			event.start?.dateTime ||
			event.start?.date ||
			event.start_time ||
			event.dtstart ||
			event.start;

		if (!start) {
			console.warn("No start date found in event:", event);
			return "";
		}

		try {
			const startDate = new Date(start);
			if (isNaN(startDate.getTime())) {
				console.warn("Invalid date:", start);
				return "";
			}

			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const eventDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());

			// Check if it's today
			if (eventDay.getTime() === today.getTime()) {
				return "Today";
			}

			// Check if it's tomorrow
			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			if (eventDay.getTime() === tomorrow.getTime()) {
				return "Tomorrow";
			}

			// Check if it's this week (within 7 days)
			const daysDiff = Math.floor((eventDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
			if (daysDiff >= 0 && daysDiff < 7) {
				return startDate.toLocaleDateString("en-US", {
					weekday: "long",
				});
			}

			// Otherwise show full date
			return startDate.toLocaleDateString("en-US", {
				weekday: "short",
				month: "short",
				day: "numeric",
			});
		} catch (err) {
			console.error("Error formatting date:", err, start);
			return "";
		}
	}

	function formatEventTime(event: any): string {
		// Try multiple possible property names for the start date
		const start =
			event.start?.dateTime ||
			event.start?.date ||
			event.start_time ||
			event.dtstart ||
			event.start;

		if (!start) return "";

		// Check if it's an all-day event
		if (isAllDayEvent(event)) {
			return "All day";
		}

		try {
			const startDate = new Date(start);
			if (isNaN(startDate.getTime())) {
				return "";
			}
			return startDate.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		} catch (err) {
			console.error("Error formatting time:", err, start);
			return "";
		}
	}

	function formatEventEndTime(event: any): string {
		// Try multiple possible property names for the end date
		const end =
			event.end?.dateTime || event.end?.date || event.end_time || event.dtend || event.end;

		if (!end) return "";

		// Check if it's an all-day event
		if (isAllDayEvent(event)) {
			return "";
		}

		try {
			const endDate = new Date(end);
			if (isNaN(endDate.getTime())) {
				return "";
			}
			return endDate.toLocaleTimeString("en-US", {
				hour: "numeric",
				minute: "2-digit",
				hour12: true,
			});
		} catch (err) {
			console.error("Error formatting end time:", err, end);
			return "";
		}
	}

	function formatEventDuration(event: any): string {
		const start = event.start?.dateTime || event.start?.date;
		const end = event.end?.dateTime || event.end?.date;

		if (!start || !end) return "";

		const startDate = new Date(start);
		const endDate = new Date(end);
		const durationMs = endDate.getTime() - startDate.getTime();
		const durationHours = durationMs / (1000 * 60 * 60);

		if (durationHours < 1) {
			const minutes = Math.round(durationMs / (1000 * 60));
			return `${minutes}m`;
		} else if (durationHours < 24) {
			return `${Math.round(durationHours * 10) / 10}h`;
		} else {
			const days = Math.round(durationHours / 24);
			return `${days}d`;
		}
	}

	onMount(() => {
		// Try to fetch immediately, but it will also trigger reactively when connection is ready
		fetchEvents();
		// Refresh every 5 minutes
		refreshInterval = setInterval(
			() => {
				hasFetched = false; // Allow refetch
				fetchEvents();
			},
			5 * 60 * 1000
		);
	});

	onDestroy(() => {
		if (refreshInterval) {
			clearInterval(refreshInterval);
		}
	});
</script>

<div class="tile calendar glass-panel">
	{#if showTitle}
		<div class="header">
			<div class="title">
				<Calendar size={18} />
				<span>{label || "Calendar"}</span>
			</div>
		</div>
	{/if}

	<div class="content">
		{#if loading}
			<div class="loading">Loading events...</div>
		{:else if error}
			<div class="error">{error}</div>
		{:else if events.length === 0}
			<div class="empty">
				No upcoming events
				<div class="debug-info" style="font-size: 0.7rem; opacity: 0.5; margin-top: 0.5rem;">
					Events fetched: {events.length}
				</div>
			</div>
		{:else}
			<div class="events-list">
				{#each events as event}
					<div class="event glass-panel">
						<div class="event-date-time">
							<div class="event-date">
								<Calendar size={12} />
								<span>{formatEventDate(event) || "Date TBD"}</span>
							</div>
							{#if !isAllDayEvent(event)}
								<div class="event-time">
									<Clock size={12} />
									<span>
										{formatEventTime(event) || "Time TBD"}
										{#if formatEventEndTime(event)}
											<span class="time-separator">–</span>
											{formatEventEndTime(event)}
										{/if}
									</span>
									{#if formatEventDuration(event)}
										<span class="duration">({formatEventDuration(event)})</span>
									{/if}
								</div>
							{:else}
								<div class="event-time">
									<Clock size={12} />
									<span>{formatEventTime(event) || "All day"}</span>
								</div>
							{/if}
						</div>
						<div class="event-title">{event.summary || event.title || "Untitled Event"}</div>
						{#if event.location}
							<div class="event-location">
								<MapPin size={24} />
								<span>{event.location}</span>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.tile {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		height: auto;
		min-height: 200px;
		width: 100%;
		box-sizing: border-box;
	}

	.header {
		margin-bottom: 0.75rem;
	}

	.title {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.9rem;
		font-weight: 600;
		opacity: 0.9;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	.content {
		flex: 1;
		overflow: visible;
		display: flex;
		align-items: stretch;
	}

	.loading,
	.error,
	.empty {
		padding: 1rem 0;
		text-align: center;
		opacity: 0.6;
		font-size: 0.85rem;
	}

	.error {
		color: rgba(231, 76, 60, 0.9);
	}

	.events-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.event {
		padding: 0.75rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		border-radius: 6px;
		transition: all 0.2s ease;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 100%;
		align-items: stretch;
		height: auto;
	}

	.event:hover {
		background: rgba(255, 255, 255, 0.08);
		transform: translateX(2px);
	}

	.event-date-time {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		margin-bottom: 0.5rem;
	}

	.event-date {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.8rem;
		font-weight: 600;
		opacity: 0.9;
		color: rgba(255, 255, 255, 0.95);
	}

	.event-time {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.75rem;
		opacity: 0.75;
	}

	.time-separator {
		margin: 0 0.25rem;
		opacity: 0.6;
	}

	.duration {
		opacity: 0.5;
		font-size: 0.7rem;
		margin-left: 0.25rem;
	}

	.event-title {
		font-size: 0.9rem;
		font-weight: 500;
		margin-bottom: 0.25rem;
		line-height: 1.3;
	}

	.event-location {
		display: flex;
		align-items: flex-start;
		gap: 0.25rem;
		font-size: 0.75rem;
		opacity: 0.6;
		margin-top: 0.25rem;
	}

	/* Scrollbar styling */
	.content::-webkit-scrollbar {
		width: 4px;
	}

	.content::-webkit-scrollbar-track {
		background: rgba(255, 255, 255, 0.05);
		border-radius: 2px;
	}

	.content::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.2);
		border-radius: 2px;
	}

	.content::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.3);
	}
</style>
