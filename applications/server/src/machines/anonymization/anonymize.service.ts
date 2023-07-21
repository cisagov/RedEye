import path from 'path';
import { Worker } from 'worker_threads';
import type { AnonymizationMachineContext } from './anonymization.machine';

export const anonymizeService = (context: AnonymizationMachineContext) =>
	new Promise<never>((resolve, reject) => {
		const worker = new Worker(path.join(__dirname, './anonymization.worker.js'), {
			execArgv: [],
			workerData: {
				...context,
				path: './anonymization.worker.ts',
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
