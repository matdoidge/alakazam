import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true
	},
	build: {
		// Ensure assets are built with correct paths for HACS
		assetsInlineLimit: 0, // Don't inline small assets
		rollupOptions: {
			output: {
				// Use relative paths for assets
				assetFileNames: 'assets/[name]-[hash][extname]',
				chunkFileNames: 'assets/[name]-[hash].js',
				entryFileNames: 'assets/[name]-[hash].js'
			}
		}
	}
});
