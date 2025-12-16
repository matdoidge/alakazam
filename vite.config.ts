import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true
	},
	base: './', // Use relative base path for subdirectory deployment
	build: {
		// Ensure assets are built with correct paths for HACS
		assetsInlineLimit: 0, // Don't inline small assets
		rollupOptions: {
			output: {
				// Use relative paths for assets
				assetFileNames: '_app/immutable/assets/[name]-[hash][extname]',
				chunkFileNames: '_app/immutable/chunks/[name]-[hash].js',
				entryFileNames: '_app/immutable/entry/[name]-[hash].js'
			}
		}
	}
});
