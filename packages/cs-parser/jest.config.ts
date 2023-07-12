import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	displayName: 'parser',
	preset: '../../jest.preset.ts',
	testEnvironment: 'node',
	transform: {
		'^.+\\.(ts|html)$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.spec.json',
			},
		],
	},
	reporters: ['default', ['jest-junit', { outputName: 'junit.cs-parser.xml' }]],
	coverageReporters: ['clover'],
	coverageDirectory: '../../coverage/packages/cs-parser',
};

export default config;
