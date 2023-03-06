import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	displayName: 'server',
	preset: '../../jest.preset.ts',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
		},
	},
	coverageReporters: ['clover'],
	reporters: ['default', ['jest-junit', { outputName: 'junit.server.xml' }]],
	coverageDirectory: '../../coverage/applications/server',
};

export default config;
