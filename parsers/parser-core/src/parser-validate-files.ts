export interface ParserValidateFiles {
	/**
	 * A list of servers and the number of files associated with each server
	 * @example
	 * servers = [
	 * 	{ name: 'server1', fileCount: 2 },
	 * 	{ name: 'server2', fileCount: 1 },
	 * ]
	 */
	servers: { name: string; fileCount?: number }[];
	/**
	 * An array of valid file paths relative to the campaign root directory
	 * @example
	 * valid = ['/campaign/server-1/file1.json', '/campaign/server-1/file2.json']
	 */
	valid: string[];
	/**
	 * An array of invalid file paths relative to the campaign root directory
	 * @example
	 * invalid = ['/campaign/server-1/file3.jpg', '/campaign/server-1/file4.xml']
	 */
	invalid: string[];
}
