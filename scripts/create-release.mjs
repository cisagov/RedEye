import {resolve} from 'node:path';
import {readdir} from 'node:fs/promises';
import {exec} from 'node:child_process';

const NODE_VER = 'node18';
const rootDir = process.cwd();

const releaseDir = resolve(rootDir, 'releases');
const OS_ARCH = {
	'mac': 'macos-x64',
	'linux': 'linux-x64',
	'windows': 'win-x64',
	'mac-arm': 'macos-arm64'
}

const PARSERS = [];
for await (const dirFile of await readdir(resolve(rootDir, 'parsers'), {withFileTypes: true})) {
	if (dirFile.isDirectory() && dirFile.name.endsWith('parser')) {
		PARSERS.push(dirFile.name);
	}
}
const PROJECTS = [
	'applications/server',
	...PARSERS.map(parser => `parsers/${parser}`)
]

for (const project of PROJECTS) {
	for (const [OS, PKG_KEY] of Object.entries(OS_ARCH)) {
		exec(`pkg ${project} -t ${NODE_VER}-${PKG_KEY} -o ${resolve(releaseDir, OS)}`);
	}
}



for (const os of Object.keys(OS_ARCH)) {
	exec(`zip -r RedEye-${os}.zip ${os}`, {cwd: releaseDir});
	exec(`rm -rf ${os}`, {cwd: releaseDir});
}
