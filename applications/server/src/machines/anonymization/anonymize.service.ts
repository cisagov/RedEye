import path from 'path';
import { Worker } from 'worker_threads';
import type { AnonymizationMachineContext } from './anonymization.machine';

export const anonymizeService = (context: AnonymizationMachineContext) =>
	new Promise<never>((resolve, reject) => {
		// Check if the __filename is correct and use the current directory
		// if it is not correct then use process.cwd() to get the correct path
		const currentDir = __filename.endsWith('anonymize.service.js')
			? __dirname
			: path.join(process.cwd(), 'dist', 'machines', 'anonymization');
		const worker = new Worker(path.join(currentDir, 'anonymization.worker.js'), {
			execArgv: [],
			workerData: {
				...context,
				path: path.join(currentDir, 'anonymization.worker.ts'),
			},
		});
		worker.postMessage({});
		worker.on('message', (message) => {
			return resolve(message);
		});
		worker.on('error', (error) => {
			return reject(error);
		});
	});
