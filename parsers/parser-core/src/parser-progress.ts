export interface ParserProgress {
	/**
	 * The percent progress of the parsing process, a number between 0 and 100
	 * @example
	 * percent = 50
	 */
	percent: number;
	/**
	 * The current state of the parsing process
	 * @example
	 * state = 'Processing logs for beacon "233" on host "DESKTOP-123"'
	 * state = 'Parsing file 1 of 1'
	 */
	message: string;
}
