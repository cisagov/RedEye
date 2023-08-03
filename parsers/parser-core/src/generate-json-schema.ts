import { resolve } from 'path';

import * as TJS from 'typescript-json-schema';
import { writeJSON } from 'fs-extra';

const settings: TJS.PartialArgs = {
	ref: true,
	strictNullChecks: true,
	required: true,
	typeOfKeyword: false,
	ignoreErrors: true,
	topRef: true,
};

const compilerOptions: TJS.CompilerOptions = {
	strictNullChecks: true,
};

const outputDir = resolve(__dirname, '..', '..', '..', 'docs', 'parser-guide', 'command-schemas');

const createSchema = (tsFilePath: string, typeName: string, outPath: string) =>
	writeJSON(
		outPath,
		TJS.generateSchema(TJS.getProgramFromFiles([tsFilePath], compilerOptions), typeName, {
			...settings,
			include: [tsFilePath],
		}),
		{ spaces: 2 }
	);

Promise.allSettled([
	createSchema(
		resolve(__dirname, 'parser-info', 'index.ts'),
		'ParserInfo',
		resolve(outputDir, 'parser-info.schema.json')
	),
	createSchema(resolve(__dirname, 'parser-output', 'index.ts'), '*', resolve(outputDir, 'parser-output.schema.json')),
	createSchema(
		resolve(__dirname, 'parser-progress.ts'),
		'ParserProgress',
		resolve(outputDir, 'parser-progress.schema.json')
	),
	createSchema(resolve(__dirname, 'logging.ts'), 'LoggerOptions', resolve(outputDir, 'logging.schema.json')),
	createSchema(
		resolve(__dirname, 'parser-validate-files.ts'),
		'*',
		resolve(outputDir, 'parser-validate-files.schema.json')
	),
]);
