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
	 * An array of valid file names
	 * @example
	 * valid = ['file1.json', 'file2.json']
	 */
	valid: string[];
	/**
	 * An array of invalid file names
	 * @example
	 * invalid = ['file3.jpg', 'file4.xml']
	 */
	invalid: string[];
}
