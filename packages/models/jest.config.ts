import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	displayName: 'models',
	preset: '../../jest.preset.js',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
		},
	},
	coverageReporters: ['clover'],
	reporters: ['default', ['jest-junit', { outputName: 'junit.models.xml' }]],
	coverageDirectory: '../../coverage/packages/models',
};

export default config;
