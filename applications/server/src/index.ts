import 'reflect-metadata';
import * as process from 'process';
import { startServerService } from './machines/server.machine';
import { Command } from 'commander';

export type cliArgs = {
	developmentMode?: boolean;
	childProcesses?: number;
	port?: number;
	redTeam?: boolean;
	password?: string;
};

const callback = (arg: cliArgs) => {
	const serverService = startServerService(arg);

	try {
		// For some reason process.on is undefined sometimes
		process.on('SIGINT', (code) => {
			console.log(`SIGINT signal received: closing HTTP server, CODE: ${code}`);
			serverService.send('KILL_SERVICE');
		});
		// eslint-disable-next-line no-empty
	} catch {}
};

const program = new Command();
program
	.option('-d, --developmentMode [boolean]', 'put the database and server in development mode')
	.option('-r, --redTeam [boolean]', 'run the server in red team mode')
	.option('--port [number]', 'the port the server should be exposed at')
	.option('-p, --password [string]', 'the password for user authentication')
	.option('-t, --childProcesses [number]', 'max # of child processes the parser can use')
	.action(callback)
	.parse();
