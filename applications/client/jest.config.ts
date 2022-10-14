/* eslint-disable */
export default {
	displayName: 'client',
	preset: '../../jest.preset.js',
	globals: {
		'ts-jest': {
			tsconfig: '<rootDir>/tsconfig.spec.json',
		},
	},
	coverageDirectory: '../../coverage/applications/client',
};
