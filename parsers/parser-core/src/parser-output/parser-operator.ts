export interface ParserOperator {
	/**
	 * The name of the operator
	 */
	name: string;
	/**
	 * The date and time the operator first sent a command
	 * @example
	 * startTime = new Date('<date of first command>')
	 */
	startTime?: Date;
	/**
	 * The date and time the operator last sent a command
	 * @example
	 * // If the operator is still active
	 * endTime = new Date()
	 * // If the operator has never sent a command
	 * endTime = undefined
	 * // If the operator is no longer active
	 * endTime = new Date('<date of last command>')
	 */
	endTime?: Date;
}
