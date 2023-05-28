import fs from 'fs-extra';
import path from 'path';

export const parseFiles = async (filePath: string) => {
	const commands: {
		[date: string]: {
			[beaconId: string]: {
				[commandInputTime: string]: { input: any; output: string | undefined; sent: any; filePath: string } | null;
			};
		};
	} = {};
	for (const file of fs.readdirSync(filePath, { withFileTypes: true })) {
		if (file.isDirectory()) {
			if (dateDirectory.test(file.name)) {
				commands[file.name] = await parseDirectory(path.join(filePath, file.name));
			}
		}
	}
	return commands;
};

const dateDirectory = /^\d{2}-\d{2}-\d{4}$/;

const tokens = {
	date: /\d{4}\/\d{2}\/\d{2}/,
	timestamp: /\d{2}:\d{2}:\d{2}/,
	infoBox: /\[.*]/,
	timezone: /UTC/,
	endOutput: /^\+-*\+$/,
	sentBox: /\[sent .*]/,
	startOutput: '[*]',
};

const inputLine = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2} UTC \[input] (.*)/;
const sentLine = /\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2} UTC \[sent (.*)]/;

const lexer = (line: string, lineNumber: number) => {
	if (!line) return;
	if (line.startsWith(tokens.startOutput)) return line;
	const items = line.split(' ');
	if (items.length === 0) {
		return null;
	}

	const [date, timestamp, timezone, info, ...rest] = items;
	if (info === '[input]') {
		const [user, , ...command] = rest;
		return {
			lineNumber,
			date,
			timestamp,
			timezone,
			info,
			user,
			command,
		};
	}
	return {
		lineNumber,
		date,
		timestamp,
		timezone,
		info,
		rest,
	};
};

const parseDirectory = async (directory: string) => {
	return Object.fromEntries(
		fs.readdirSync(directory, { withFileTypes: true }).map((file) => {
			if (file.isFile() && file.name.endsWith('log')) {
				const inputs: any[] = [],
					sents: any[] = [],
					outputs: (string | undefined)[] = [];
				const currentFilePath = path.join(directory, file.name);
				const logFile = fs.readFileSync(currentFilePath, 'utf8');
				const lines = logFile.split('\n');
				const totalLength = lines.length;
				while (lines.length > 0) {
					const nextLine = lines.at(0);
					if (nextLine?.match(inputLine)?.length) {
						inputs.push(lexer(lines.shift()!, lines.length + 1 - totalLength));
					} else if (nextLine?.match(sentLine)?.length) {
						sents.push(lexer(lines.shift()!, lines.length + 1 - totalLength));
					} else if (nextLine?.startsWith('[*]') || nextLine?.startsWith('[+]') || nextLine?.startsWith('[-]')) {
						outputs.push(handleOutput(lines));
					} else {
						lines.shift();
					}
				}
				const logs = Object.fromEntries(
					inputs.map((input, index) => [
						input.timestamp,
						{
							filePath: currentFilePath,
							input,
							sent: sents.at(index),
							output: outputs.at(index),
						},
					])
				);
				return [file.name.replace('.log', ''), logs];
			} else {
				return [file.name, null];
			}
		})
	);
};

const handleOutput = (lines: string[]) => {
	let output = '';
	let outputLine = lines.shift();
	while (outputLine !== undefined) {
		output += outputLine + '\n';
		outputLine = lines.shift();
		if (
			outputLine === undefined ||
			outputLine.startsWith('+-------------------------------------------------------------------+')
		) {
			if (!lines.at(0)?.startsWith('[*] Download complete')) {
				outputLine = undefined;
				break;
			}
		}
	}
	return output;
};
