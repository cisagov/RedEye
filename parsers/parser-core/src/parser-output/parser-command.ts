import { ParserLogEntry } from './parser-log-entry';

export interface ParserCommand {
	/**
	 * Name of the operator that sent the command
	 * Should match the name of an operator in the operators object
	 * @example
	 * operator = 'admin'
	 */
	operator?: string;
	/**
	 * Name of the beacon that the command was run from
	 * Should match the name of a beacon in the beacons object
	 * @example
	 * beacon = 'beacon1'
	 */
	beacon: string;
	/**
	 * The input that initialized the command
	 * @example
	 * input = {
	 *  blob: 'ls',
	 *  filepath: '<directory-of-parser>/logs/2023-02-01/log-1.txt',
	 *  lineNumber: 123,
	 *  logType: 'INPUT',
	 *  dateTime: new Date("2021-01-01T00:00:00.000Z")
	 *  }
	 *
	 */
	input: ParserLogEntry;
	/**
	 * Whether the command was successful
	 * @default false
	 * @example
	 * // The command output was not found in the logs or the command failed
	 * commandFailed = true
	 */
	commandFailed?: boolean;
	/**
	 * The output of the command
	 * @example
	 * // If the command was successful
	 * output = {
	 * 	blob: '[System Process]\nsmss.exe\n...etc',
	 * 	filepath: '<directory-of-parser>/logs/2023-02-01/log-1.txt',
	 * 	lineNumber: 123,
	 * 	logType: 'OUTPUT',
	 * 	dateTime: new Date("2021-01-01T00:00:00.000Z")
	 * }
	 * // If the command failed
	 * output = undefined
	 * // or
	 * output = {
	 * 		blob: 'Unknown command: pwd',
	 * 		filepath: '<directory-of-parser>/logs/2023-02-01/log-1.txt',
	 * 		lineNumber: 123,
	 * 		logType: 'ERROR',
	 * 		dateTime: new Date("2021-01-01T00:00:00.000Z")
	 * 	}
	 */
	output?: ParserLogEntry;
	/**
	 * A list of the MITRE ATT&CK techniques used by the command
	 * @default []
	 * @example
	 * attackIds = ['T1059', 'T1059.001']
	 */
	attackIds?: string[];
}
