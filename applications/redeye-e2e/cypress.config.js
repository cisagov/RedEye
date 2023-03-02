const { defineConfig } = require('cypress');

const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
	fixturesFolder: path.join(__dirname, 'src', 'fixtures'),
	modifyObstructiveCode: false,
	videoUploadOnPasses: false,
	videosFolder: path.join(__dirname, '../../dist/applications/redeye-e2e/videos'),
	screenshotsFolder: path.join(__dirname, '../../dist/applications/redeye-e2e/screenshots'),
	failOnStatusCode: false,
	viewportWidth: 1920,
	viewportHeight: 1080,
	reporter: path.join(__dirname, '../../node_modules/cypress-multi-reporters'),
	reporterOptions: {
		configFile: path.join(__dirname, 'reporter-config.json'),
	},
	e2e: {
		setupNodeEvents(on, config) {
			on('task', {
				// ===== task to use node 'fs' (filesystem) to read directory=====
				readdir({ dirPath }) {
					return new Promise((resolve, reject) => {
						try {
							const dirData = fs.readdirSync(dirPath);
							resolve(dirData);
						} catch (e) {
							reject(e);
						}
					});
				},
				// ===== task to use node 'fs' (filesystem) to delete downloaded files from cypress/downloads
				deleteDownloads({ dirPath }) {
					fs.readdir(dirPath, (err, files) => {
						for (const file of files) {
							fs.unlink(path.join(dirPath, file), (err) => {
								console.log('Removed ' + file);
							});
						}
					});
					return null;
				},
			});
		},
		specPattern: '**/**/e2e/**/*.cy.js',
		supportFile: path.join(__dirname, 'src', 'support', 'e2e.js'),
		excludeSpecPattern: '*.skip.js',
		defaultCommandTimeout: 15000,
	},
});
