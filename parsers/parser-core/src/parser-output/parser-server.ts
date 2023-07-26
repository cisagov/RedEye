import type { ServerType } from '@redeye/models';

export interface ParserServer {
	/**
	 * The name of the server
	 */
	name: string;
	/**
	 * The type of server
	 * @enum {'http' | 'https' | 'smb' | 'dns'}
	 * @default 'http'
	 * @example
	 * type = 'https'
	 */
	type?: keyof typeof ServerType;
}
