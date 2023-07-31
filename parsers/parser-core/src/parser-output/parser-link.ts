export interface ParserLink {
	/**
	 * The origin of the link, can be a beacon or server
	 * @example
	 * from = 'beacon1'
	 * from = 'server1'
	 */
	from: string;
	/**
	 * The destination of the link, can be a beacon
	 * @example
	 * to = 'beacon2'
	 */
	to: string;
}
