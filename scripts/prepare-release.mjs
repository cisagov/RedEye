import {readdir} from 'node:fs/promises';
import {exec} from 'node:child_process';
import { resolve } from "path";
import {fileURLToPath} from "node:url";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const WorkspaceDirs = ['applications', 'parsers', 'packages'];
const rootDir = resolve(__dirname, '..');
const scaffoldDirs = [];
for (const dir of WorkspaceDirs) {
	for await (const dirFile of await readdir(resolve(rootDir, dir), {withFileTypes: true})) {
		if (dirFile.isDirectory()) {
			scaffoldDirs.push(dirFile.name);
		}
	}
}

exec(`yarn moon docker scaffold ${scaffoldDirs.join(' ')}`);


