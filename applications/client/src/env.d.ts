interface ImportMetaEnv {
	VITE_BLUE_TEAM: string;
	VITE_SERVER_URL: string;
}

declare const PACKAGE_VERSION: string;

declare module '*?worker' {
	const workerConstructor: {
		new (): Worker;
	};
	// eslint-disable-next-line import/no-default-export
	export default workerConstructor;
}

declare global {
	// eslint-disable-next-line no-var,vars-on-top
	var Cypress: any | undefined;
}
