/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');

module.exports = (on) => {
	on('task', {
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
		getPath({ dirPath }) {
			return new Promise((resolve, reject) => {
				try {
					const dirData = path.resolve(dirPath);
					resolve(dirData);
				} catch (e) {
					reject(e);
				}
			});
		},
	});
};
