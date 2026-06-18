import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			adapter: adapter({
				fallback: 'index.html'
			})
		}),
		VitePWA({
			registerType: 'autoUpdate',
			scope: '/',
			base: '/',
			manifest: {
				name: 'BetweenUs',
				short_name: 'BetweenUs',
				description: 'Entdeckt gemeinsam, was euch verbindet.',
				theme_color: '#ec4899',
				background_color: '#ffffff',
				display: 'standalone',
				start_url: '/',
				scope: '/',
				icons: [
					{ src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
				navigateFallback: 'index.html',
				cleanupOutdatedCaches: true
			}
		})
	],
	define: {
		__APP_VERSION__: JSON.stringify(process.env.npm_package_version)
	},
	server: {
		host: '0.0.0.0',
		port: 5173
	}
});
