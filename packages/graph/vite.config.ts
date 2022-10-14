import { defineConfig } from 'vite';
import autoExternal from 'rollup-plugin-auto-external';

export default defineConfig(() => ({ plugins: [autoExternal()] }));
