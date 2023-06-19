import { findCommandText } from './regex';
import { BeaconLineType, LogEntry, LogType } from '@redeye/models';

import type { InternalCommand } from './identifyCommandGroupings';

const noOutputsList = [
	'sleep',
	'cd',
	'clear',
	'kill',
	'BTasked',
	'loadTickets',
	'mv',
	'powershell-import',
	'jobkill',
	'rev2self',
	'rm',
	'shinject',
	'upload',
];

const singleOutput = [
	'pwd',
	'ls',
	'rev2self',
	'upload',
	'drives',
	'execute-assembly',
	'exit',
	'jobs',
	'link',
	'logonpasswords',
	'make_token',
	'mimikatz',
	'dcsync',
	'ps',
	'pwd',
	'run',
	'socks', // This spins up a server of some kind (SOCKS4a)
	'steal_token',
	'unlink', // For whatever reason the output is an error when it succeeds #programmerLogic
];
const oneToMany = ['jump', 'download', 'portscan', 'powerpick', 'psexec', 'saveTGTdeleg', 'pth', 'elevate'];

export type LogFilterMethod = (logLine: LogEntry, logLines: LogEntry[]) => boolean;
/**
 * Greedy parsing rules parse all the log lines for a given beacon
 * filterMethod should not contain side-effects.
 */
type GreedyParsingRule = {
	keyword: string;
	lines: 'greedy';
	filterMethod: LogFilterMethod;
};

/**
 * Needy parsing rules parse all the expected outputs from a call stack
 * filterMethod should not contain side-effects.
 */
type NeedyParsingRule = {
	keyword: string;
	lines: 'needy';
	filterMethod: LogFilterMethod;
};

type SpecialParsingRule = GreedyParsingRule | NeedyParsingRule;

type BasicParsingRule = {
	lines: number | 'unknown' | 'oneOrMore';
};

type ParsingRule = BasicParsingRule | SpecialParsingRule;

// TODO: add greedy portscan
// TODO: add greedy powerpick
// TODO: enable greedy psexec for different scripts?
// TODO: add greedy saveTGTdeleg
const specialOutputList: SpecialParsingRule[] = [
	{
		keyword: 'keylogger',
		lines: 'greedy',
		filterMethod: (logLine) => {
			if (logLine.logType === LogType.KEYSTROKES) {
				return true;
			} else if (logLine.blob) {
				const blob = logLine.blob ?? '';
				return /received keystrokes/.test(blob);
			} else return false;
		},
	},
	{
		keyword: 'screenshot',
		lines: 'needy',
		filterMethod: (logLine) => {
			if (logLine.blob && logLine.blob.includes('screenshot')) {
				return true;
			}
			return false;
		},
	},
];

export type ParsingRuleTuple = [InternalCommand, ParsingRule];

export const findParsingRules = (commands: InternalCommand[]): ParsingRuleTuple[] => {
	return commands.map((command) => {
		// If there is an error, then there won't be an associated output
		if (!command.output.every((output) => output.lineType !== BeaconLineType.ERROR)) return [command, { lines: 0 }];

		const commandInputText = findCommandText(command.input.blob ?? '');
		if (noOutputsList.includes(commandInputText)) return [command, { lines: 0 }];
		if (singleOutput.includes(commandInputText)) return [command, { lines: 1 }];
		if (oneToMany.includes(commandInputText)) return [command, { lines: 'oneOrMore' }];
		const specialOutput = specialOutputList.find((li) => li.keyword === commandInputText);
		if (specialOutput) return [command, specialOutput];
		else return [command, { lines: 'unknown' }];
	});
};

export const isGreedyRule = (value: ParsingRule): value is GreedyParsingRule => value.lines === 'greedy';
export const isNeedyRule = (value: ParsingRule): value is NeedyParsingRule => value.lines === 'needy';
