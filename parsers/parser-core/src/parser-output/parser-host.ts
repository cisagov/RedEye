export interface ParserHost {
	/**
	 * The name of the host
	 */
	name: string;
	/**
	 * The name of the server that first ran a command or spawned a beacon on the host
	 * This should match the name of a server in the servers object
	 */
	server: string;
	/**
	 * The operating system of the host
	 * @example
	 * os = 'Windows'
	 */
	os?: string;
	/**
	 * The version of the operating system of the host
	 * @example
	 * osVersion = '10.0.19041'
	 */
	osVersion?: string;
	/**
	 * The IP address of the host
	 * @example
	 * ip = '192.168.23.0'
	 */
	ip?: string;
	/**
	 * The type of host
	 * @example
	 * type = 'workstation'
	 * type = 'server'
	 * type = 'laptop'
	 * type = 'virtual machine'
	 */
	type?: string;
}
