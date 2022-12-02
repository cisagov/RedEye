const { defineConfig } = require('cypress');

module.exports = defineConfig({
	fixturesFolder: './src/fixtures',
	modifyObstructiveCode: false,
	video: false,
	videosFolder: '../../dist/applications/redeye-e2e/videos',
	screenshotsFolder: '../../dist/applications/redeye-e2e/screenshots',
	failOnStatusCode: false,
	experimentalWebKitSupport: true,
	viewportWidth: 1920,
	viewportHeight: 1080,
	reporter: '../../node_modules/cypress-multi-reporters',
	reporterOptions: {
		configFile: './reporter-config.json',
	},
	retries: {
		runMode: 1,
	},
	e2e: {
		setupNodeEvents(on, config) {},
		experimentalSessionAndOrigin: true,
		specPattern: '../../**/*.cy.js',
		supportFile: './src/support/index.js',
		excludeSpecPattern: '*.skip.js',
		defaultCommandTimeout: 15000,
	},
});
