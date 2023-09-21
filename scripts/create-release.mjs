import { resolve, join } from 'node:path';
import { readdir } from 'node:fs/promises';
import childProc from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const exec = promisify(childProc.exec);

const NODE_VER = 'node18';
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const rootDir = resolve(__dirname, '..');
const releaseDir = resolve(rootDir, 'release');


const OS_ARCH = {
	mac: 'macos-x64',
	linux: 'linux-x64',
	windows: 'win-x64',
	'mac-arm': 'macos-arm64',
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

for (const [OS, PKG_KEY] of Object.entries(OS_ARCH)) {
	for (const project of PROJECTS) {
		await exec(
			`yarn pkg ${project.path} -t ${NODE_VER}-${PKG_KEY} -o ${resolve(releaseDir, `RedEye-${OS}`, project.out)}`
		);
	}
}
