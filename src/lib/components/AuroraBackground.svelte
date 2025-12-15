<script>
	// No script needed for pure CSS animation
</script>

<div class="gradient-bg"></div>

<style>
	.gradient-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		background: linear-gradient(-45deg, #38086c, #14408c, #540e1a); /* Purple, Blue, Pink */
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
