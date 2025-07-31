import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
	base: './',
	plugins: [react()],
	test: {
		environment: 'jsdom',
		globals: true,
		transformMode: {
			web: [/\.[jt]sx$/],
		},
	},
	build: {
		outDir: path.resolve(__dirname, '../server/static'),
		emptyOutDir: true,
	},
	server: {
		port: 3000,
		cors: true,
	},
});
