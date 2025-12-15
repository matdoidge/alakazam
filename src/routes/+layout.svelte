<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import AuroraBackground from "$lib/components/AuroraBackground.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<AuroraBackground />
{@render children()}
