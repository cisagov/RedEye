import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// @ts-ignore
import packageJson from '../../package.json';

// https://vitejs.dev/config/
export default defineConfig(() => ({
	mode: process.env.NODE_ENV,
	root: __dirname,
	envDir: process.cwd(),
	plugins: [
		react({
			jsxImportSource: '@emotion/react',
			babel: {
				plugins: [
					['@babel/plugin-proposal-decorators', { legacy: true }],
					['@babel/plugin-proposal-class-properties', { loose: true }],
					[
						'@emotion',
						{
							// sourceMap is on by default but source maps are dead code eliminated in production
							sourceMap: true,
							autoLabel: 'dev-only',
							labelFormat: '[local]',
							cssPropOptimization: true,
						},
					],
				],
			},
		}),
		tsconfigPaths({}),
		checker({
			typescript: true,
			overlay: { initialIsOpen: false },
			eslint: {
				lintCommand: 'eslint ./src/**/*.{ts,tsx}',
			},
		}),
	],
	resolve: {
		alias: {
			'@redeye/client': '/src',
		},
	},
	esbuild: {
		logOverride: { 'this-is-undefined-in-esm': 'silent' },
	},
	base: '',
	build: {
		outDir: './dist',
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-router-dom', 'react-dom', 'mobx', 'mobx-keystone', 'mobx-react-lite'],
				},
			},
		},
	},
	server: {
		port: 3500,
		hmr: {
			overlay: false,
			host: 'localhost',
		},
	},
	define: {
		PACKAGE_VERSION: `'${packageJson.version}'`,
		'process.env': {},
	},
}));
