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
	createSchema(resolve(__dirname, '..', 'parser-info.ts'), 'ParserInfo', resolve(__dirname, 'parser-info.schema.json')),
	createSchema(resolve(__dirname, '..', 'parser-output.ts'), '*', resolve(__dirname, 'parser-output.schema.json')),
	createSchema(
		resolve(__dirname, '..', 'parser-progress.ts'),
		'ParserProgress',
		resolve(__dirname, 'parser-progress.schema.json')
	),
	createSchema(resolve(__dirname, '..', 'logging.ts'), 'LoggerOptions', resolve(__dirname, 'logging.schema.json')),
]);
