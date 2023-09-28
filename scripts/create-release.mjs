import { resolve } from 'node:path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import {exec as pkgExec} from 'pkg'

const {
	values: {
		/** @type {string} */
		nodeVersion,
		/** @type {['all'] | ('mac' | 'linux' | 'windows' | 'mac-arm')[]} */
		os
	},
} = parseArgs({
	options: {
		nodeVersion: {
			type: "string",
			short: "n",
			default: "18.15.0",
		},
		os: {
			type: "string",
			multiple: true,
			default: ["all"],
			short: "o",
		},
	},
});


const NODE_VER = nodeVersion;
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const rootDir = resolve(__dirname, '..');
const releaseDir = resolve(rootDir, 'release');


const OS_ARCH = {
	mac: {
		platform: 'macos',
		arch: 'x64',
	},
	linux: {
		platform: 'linux',
		arch: 'x64',
	},
	windows: {
		platform: 'windows',
		arch: 'x64',
	},
	// 'mac-arm': {
	// 	platform: 'macos',
	// 	arch: 'arm64',
	// },
};

const PARSERS = [];
for (const dirFile of await readdir(resolve(rootDir, 'parsers'), { withFileTypes: true })) {
	if (dirFile.isDirectory() && dirFile.name.endsWith('parser')) {
		PARSERS.push(dirFile.name);
	}
}
const PROJECTS = [
	{ path: 'applications/server/package.json', out: 'RedEye' },
	...PARSERS.map((parser) => ({ path: `parsers/${parser}`, out: `parsers/${parser}` })),
];
const isAllOS = os.includes('all');
for (const [OS, PKG_KEY] of Object.entries(OS_ARCH)) {
	if (!isAllOS && !os.includes(OS)) {
		continue;
	}
	console.log('Building for: ', OS)
	for (const project of PROJECTS) {
		console.log('\tBuilding: ', project.path)
		await pkgExec(
			[project.path, '-t', `node${NODE_VER}-${PKG_KEY.platform}-${PKG_KEY.arch}`,  '-o', resolve(releaseDir, `RedEye-${OS}`, project.out)]
		);
	}
}
