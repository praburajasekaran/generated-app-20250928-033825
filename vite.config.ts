import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'
// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Zenith Note',
				short_name: 'Zenith',
				description: 'A minimalist, PWA chat interface to conversationally manage your knowledge base, inspired by Obsidian.',
				theme_color: '#0f172a',
				background_color: '#0f172a',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: 'https://framerusercontent.com/images/6fE5OZU2Ie3r5e15a3k2uA3c.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'https://framerusercontent.com/images/3tM3c3nma92r1QjE24sY2pY.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}']
			}
		})
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})