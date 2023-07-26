import { ParserCommand } from './parser-command';
import { ParserLink } from './parser-link';
import { ParserOperator } from './parser-operator';
import { ParserServer } from './parser-server';
import { ParserHost } from './parser-host';
import { ParserBeacon, ParserFile, ParserImage } from './parser-beacon';
import { ParserLogEntry } from './parser-log-entry';

export interface ParserOutput {
	/**
	 * A key-value pair of server names and their metadata
	 * @type { [serverName: string]: ParserServer }
	 * @example
	 * // If a C2 server was create with name 'server1' and will be communicating over https
	 * servers = {
	 * "server1": {
	 * 		name: "server1",
	 * 		type: 'https',
	 * 	}
	 * }
	 */
	servers: {
		[serverName: string]: ParserServer;
	};
	/**
	 * A key-value pair of host names and their metadata
	 * @type { [hostName: string]: ParserHost }
	 * @example
	 * // If the host 'DESKTOP-312' was first discovered or had a beacon spawned by server 'server1' with os 'Windows 10.0.19041'
	 * hosts = {
	 * "DESKTOP-312": {
	 * 			name: "DESKTOP-312",
	 * 			server: "server1",
	 * 			os: "Windows",
	 * 			osVersion: "10.0.19041",
	 * 			ip: '192.168.23.2',
	 * 	  	type: 'desktop',
	 * 	  }
	 * 	}
	 */
	hosts: {
		[hostName: string]: ParserHost;
	};
	/**
	 * A key-value pair of beacon names and their metadata
	 * @type { [beaconName: string]: ParserBeacon }
	 * @example
	 * // If the beacon 'beacon1' was created from server 'server1' on host 'DESKTOP-312' at 2021-01-01T00:00:00 and last checked in at 2021-02-02T00:00:02
	 * beacons = {
	 * "beacon1": {
	 * 		name: "beacon1",
	 * 		server: "server1",
	 * 		host: "DESKTOP-312",
	 * 		ip: "192.168.23.2",
	 * 		process: "svchost.exe",
	 * 		pid: 1234,
	 * 		startTime: new Date('2021-01-01T00:00:00.000Z'),
	 * 		endTime: new Date('2021-02-02T00:00:02.000Z')
	 * 	}
	 * }
	 */
	beacons: {
		[beaconName: string]: ParserBeacon;
	};
	/**
	 * A key-value pair of operator names and the time range of their first and last command
	 * @type { [operatorName: string]: ParserOperator }
	 * @example
	 * // If the operator 'admin' their first command at 2021-01-01T00:00:00 and last command at 2021-02-02T00:00:02
	 * operators = {
	 *  "admin": {
	 *  		name: "admin",
	 *  		startTime: new Date('2021-01-01T00:00:00.000Z'),
	 *  		endTime: new Date('2021-02-02T00:00:02.000Z'),
	 *  	}
	 *  }
	 */
	operators: {
		[operatorName: string]: ParserOperator;
	};
	/**
	 * A key-value pair of unique command identifiers and commands with inputs and outputs, sent by operators to beacons
	 * @type { [commandName: string]: ParserCommand }
	 * @example
	 * // If the operator 'admin' sent a command to the beacon 'beacon1' at 2021-01-01T00:00:00
	 * commands = {
	 *   "admin-beacon1-2021-01-01T00:00:00": {
	 *   	operator: "admin",
	 *   	beacon: "beacon1",
	 *   	input: {
	 *   		blob: "shell whoami",
	 *   		filepath: "C:\\Users\\admin\\Desktop\\command.txt",
	 *   		lineNumber: 1,
	 *   		logType: "BEACON"
	 *   	},
	 *   	output: {
	 *   		blob: "admin",
	 *   		filepath: "C:\\Users\\admin\\Desktop\\command.txt",
	 *   		lineNumber: 2,
	 *   		logType: "BEACON"
	 *  	},
	 *   	attackIds: ["T1033"]
	 *   }
	 * }
	 */
	commands: {
		[commandName: string]: ParserCommand;
	};
	/**
	 * A key-value pair of '<from>-<to>' and links from servers to beacons and beacons to beacons
	 * @example
	 * // If the server 'server1' has a beacon named 'beacon1'
	 * links = {
	 * 	"server1-beacon1": {
	 * 		from: "server1",
	 * 		to: "beacon1"
	 * 		}
	 * 	}
	 */
	links: {
		[linkName: string]: ParserLink;
	};
}

export {
	ParserCommand,
	ParserLink,
	ParserOperator,
	ParserServer,
	ParserHost,
	ParserBeacon,
	ParserLogEntry,
	ParserFile,
	ParserImage,
};
