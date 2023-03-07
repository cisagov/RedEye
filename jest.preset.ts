// eslint-disable-next-line import/no-anonymous-default-export
module.exports = {
	testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
	moduleFileExtensions: ['ts', 'js', 'mjs', 'html'],
	coverageReporters: ['html'],
	transform: {
		'^.+\\.(ts|js|html)$': 'ts-jest',
	},
	testEnvironment: 'jsdom',
	/**
	 * manually set the exports names to load in common js, to mimic the behaviors of jest 27
	 * before jest didn't fully support package exports and would load in common js code (typically via main field). now jest 28+ will load in the browser esm code, but jest esm support is not fully supported.
	 * In this case we will tell jest to load in the common js code regardless of environment.
	 *
	 * this can be removed via just overriding this setting in it's usage
	 *
	 * @example
	 * module.exports = {
	 *   ...nxPreset,
	 *   testEnvironmentOptions: {},
	 * }
	 */
	testEnvironmentOptions: {
		customExportConditions: ['node', 'require', 'default'],
	},
};
