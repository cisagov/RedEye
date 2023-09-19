import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
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
			tsDecorators: true,
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
		host: true,
		hmr: {
			overlay: false,
		},
	},
	define: {
		PACKAGE_VERSION: `'${packageJson.version}'`,
		'process.env': {},
	},
}));
