import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// export default defineConfig({
// 	plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://127.0.0.1:5555/',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   }
// });

// https://vite.dev/config/
export default defineConfig({
	base: './',
	plugins: [react()],
	build: {
		outDir: path.resolve(__dirname, '../server/static'),
		emptyOutDir: true,
	},
	server: {
		port: 3000,
		cors: true,
	},
});
