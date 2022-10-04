import path from 'path';
import { Worker } from 'worker_threads';
import { AnonymizationMachineContext } from './anonymization.machine';

export const anonymizeService = (context: AnonymizationMachineContext) =>
	new Promise<never>((resolve, reject) => {
		// TODO: Ensure this compiles correctly for prod
		const worker = new Worker(path.join(__dirname, './anonymization.worker.js'), {
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
