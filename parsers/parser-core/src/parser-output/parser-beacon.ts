import { BeaconType, FileFlag } from '@redeye/models';

export interface ParserBeacon {
	/**
	 * The name of the beacon
	 */
	name: string;
	/**
	 * The name of the server that spawned this beacon
	 * This should match the name of a server in the servers object
	 */
	server: string;
	/**
	 * The name of the host that this beacon is running on
	 * This should match the name of a host in the hosts object
	 * @example
	 * host = 'DESKTOP-12345'
	 */
	host: string;
	/**
	 * The IP address of the host as reported by the beacon
	 * @example
	 * ip = '192.168.23.3'
	 */
	ip?: string;
	/**
	 * The type of beacon
	 * @enum {'http' | 'https' | 'smb' | 'dns'}
	 * @example
	 * type = 'http'
	 */
	type?: BeaconType;
	/**
	 * The port that the beacon is communicating over
	 * @example
	 * // http
	 * port = 80
	 * // https
	 * port = 443
	 */
	port?: number;
	/**
	 * The process name of the beacon
	 * @example
	 * process = 'explorer.exe'
	 */
	process?: string;
	/**
	 * The process identifier of the beacon
	 * @example
	 * pid = 1234
	 */
	processId?: number;
	/**
	 * The date time the beacon was initialized or ran it's first command
	 * @example
	 * startTime = new Date('2021-01-01T00:00:00.000Z')
	 */
	startTime?: Date;
	/**
	 * The date time the beacon ran it's last command or was terminated
	 * @example
	 * endTime = new Date('2021-01-01T00:00:00.000Z')
	 */
	endTime?: Date;
	/**
	 * A list of images that the beacon has downloaded
	 * @example
	 * images = [
	 * 	{
	 * 		fileType: 'png',
	 * 		filePath: 'local/path/to/image.png',
	 * 		fileName: 'host-desktop-screenshot.png'
	 * 	}
	 * ]
	 */
	images?: ParserImage[];
	/**
	 * A list of files that the beacon has uploaded or downloaded
	 * @example
	 * files = [
	 * 	{
	 * 		filePath: 'local/path/to/file.txt',
	 * 		fileName: 'admin-list.txt',
	 * 		dateTime: new Date("2021-01-01T00:00:00.000Z"),
	 * 		md5: '1234567890abcdef1234567890abcdef',
	 * 		fileFlag: 'UPLOAD'
	 * 		// or
	 * 		fileFlag: 'DOWNLOAD'
	 * 	}
	 * ]
	 */
	files?: ParserFile[];
}

interface ParserImage {
	/**
	 * The type of image
	 * @enum {'png' | 'jpg' | 'jpeg' | 'gif' | 'svg' | 'bmp' | 'tiff' | 'webp' | 'ico' | string}
	 * @example
	 * type = 'png'
	 */
	fileType: string;
	/**
	 * Path to the image that RedEye can access
	 * @example
	 * filePath = '<directory-of-parser>/images/image.png'
	 */
	filePath: string;
	/**
	 * The name of the image if the local file name is different from the name of the image
	 * @example
	 * name = 'host-desktop-screenshot.png'
	 */
	fileName?: string;
}

interface ParserFile {
	/**
	 * The name of the file if the local file name is different from the name of the file
	 * @example
	 * name = 'admin-list.txt'
	 */
	fileName?: string;
	/**
	 * Path to the file that RedEye can access
	 * @example
	 * filePath = '<directory-of-parser>/files/file.txt'
	 */
	filePath: string;
	/**
	 * The date time the file was created or modified
	 * @example
	 * dateTime = new Date('2021-01-01T00:00:00.000Z')
	 */
	dateTime: Date;
	/**
	 * The MD5 hash of the file
	 */
	md5?: string;
	/**
	 * Was this file uploaded to the host or downloaded from the host
	 * @enum {"UPLOAD" | "DOWNLOAD"}
	 */
	fileFlag: FileFlag;
}
