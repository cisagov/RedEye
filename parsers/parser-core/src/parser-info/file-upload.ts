export interface FileUpload {
	/** The type of upload, a selection of files or a directory */
	type: keyof typeof UploadType;
	/**
	 * Describes what should be uploaded for the selected parser
	 * @example
	 * description = 'Upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/'
	 */
	description: string;
	/**
	 * A string that will be displayed in the upload form as an example of the type of file or shape of directory to upload
	 * @default undefined
	 * @example
	 * `Campaign_Folder
	 * - Server_Folder_1
	 *   - 200101
	 *   - 200102
	 *   - 200103`
	 */
	example?: string;
}

export enum UploadType {
	/**
	 * upload a single file or a selection of multiple files
	 * Use this if data is in a single file like a json or csv or a selection of files like .pcap files
	 */
	File = 'File',
	/** upload a directory */
	Directory = 'Directory',
}
