export interface ParserProgress {
	/** The current progress of the parsing process, a number between 0 and 100 */
	percent: number;
	/** The current state of the parsing process */
	message: string;
}
