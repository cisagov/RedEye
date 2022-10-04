import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	displayName: 'parser',
	preset: '../../jest.preset.js',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
		},
	},
	reporters: ['default', ['jest-junit', { outputName: 'junit.cs-parser.xml' }]],
	coverageReporters: ['clover'],
	coverageDirectory: '../../coverage/packages/cs-parser',
};

export default config;
