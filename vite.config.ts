import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true
	},
	build: {
		// Inline all assets into the HTML file for single-file deployment (HACS compatible)
		assetsInlineLimit: Infinity
	}
});
