import { BeaconLineType, LogType } from '@redeye/models';

export interface ParserLogEntry {
	/**
	 * The text of the log entry, can be a command input or output
	 * @example
	 * blob = 'ls'
	 * blob = 'cd C:\\Users\\admin\\Desktop'
	 * blob = 'dir'
	 * blob = '[System Process]\nsmss.exe\n...etc'
	 */
	blob: string;
	/**
	 * Local path to the file that the log entry was found in
	 * @example
	 * filepath = '<directory-of-parser>/logs/2023-02-01/log-1.txt'
	 */
	filepath?: string;
	/**
	 * The starting line number of the log entry in the file
	 * @example
	 * lineNumber = 123
	 */
	lineNumber?: number;
	/**
	 * The type of log line if the logType is 'BEACON'
	 * @enum {'METADATA' | 'INPUT' | 'TASK' | 'OUTPUT' | 'CHECKIN' | 'ERROR'}
	 * @example
	 * // If the log entry is a command input
	 * logType = 'INPUT'
	 * // If the log entry is a command output
	 * logType = 'OUTPUT'
	 * // If the log entry is a beacon status checkin with the server
	 * logType = 'CHECKIN'
	 * // If the log entry is the C2 server acknowledging a command
	 * logType = 'TASK'
	 * // If the log entry is an error of any kind
	 * logType = 'ERROR'
	 * // If the log entry is miscellaneous metadata tied to a beacon
	 * logType = 'METADATA'
	 */
	lineType?: BeaconLineType;
	/**
	 * The type of log entry
	 * @enum {'BEACON' | 'EVENT' | 'DOWNLOAD' | 'WEBLOG' | 'KEYSTROKES' | 'UNKNOWN'}
	 * @example
	 * // A beacon log entry
	 * logType = 'BEACON'
	 * // Misc events on the C2 server (e.g. operator login)
	 * logType = 'EVENT'
	 * // A file download from a beacon
	 * logType = 'DOWNLOAD'
	 * // A web log entry from a beacon
	 * logType = 'WEBLOG'
	 * // A keystroke log entry from a beacon
	 * logType = 'KEYSTROKES'
	 * // Any other log entry
	 * logType = 'UNKNOWN'
	 */
	logType: LogType;
	/**
	 * The date and time the log entry was created
	 * @example
	 * dateTime = new Date('2021-01-01T00:00:00.000Z')
	 */
	dateTime?: Date;
}
