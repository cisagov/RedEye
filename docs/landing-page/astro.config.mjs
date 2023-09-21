import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// base: '/RedEye' /* use for gh-pages build */,
	outDir: './dist-landing',
	vite: {
		build: {
			rollupOptions: {
				output: {
					assetFileNames: 'assets/style[extname]',
				},
			},
		},
	},
});
