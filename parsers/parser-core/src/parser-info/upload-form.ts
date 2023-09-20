import type { FileUpload } from './file-upload';

export interface UploadForm {
	/**
	 * The title of the tab in the upload form
	 * @example
	 * tabTitle = '<C2_NAME>'
	 */
	tabTitle: string;
	/**
	 * Whether the parser is enabled in blue team mode
	 * This should be false unless the parser is intended to be used by a blue team
	 * The Blue team mode is intended to be a read only mode
	 * */
	enabledInBlueTeam: boolean;
	/**
	 * The type of server delineation used by the parser
	 * @example
	 * // server data is seperated into distinct folders like 'CAMPAIGN_FOLDER/SERVER_FOLDER/DATE_FOLDER'
	 * serverDelineation = ServerDelineationTypes.Folder
	 * // server data is not in any particular file/folder structure
	 * serverDelineation = ServerDelineationTypes.Database
	 */
	serverDelineation: keyof typeof ServerDelineationTypes;
	/**
	 * An object that configures the file upload portion of the upload form
	 * @example
	 * // upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/
	 * fileUpload = {
	 * 	type: UploadType.Directory,
	 * 	description: 'Upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/',
	 * 	example: `Campaign_Folder
	 * 		- Server_Folder_1
	 * 			- 200101
	 * 			- 200102
	 * 			- 200103`,
	 * 	validate: ValidationMode.Parser
	 * }
	 */
	fileUpload: FileUpload & UploadValidation;
	/**
	 * An object that configures the list of servers/files after upload
	 * @example
	 * // server names are editable
	 * fileDisplay = { editable: true }
	 */
	fileDisplay: FileDisplay;
}

export enum ServerDelineationTypes {
	/** server data seperated into distinct folders */
	Folder = 'Folder',
	/** server data not in any particular file/folder structure */
	Database = 'Database',
}

export enum ValidationMode {
	/** no validation */
	None = 'None',
	/** validate uploaded files in client by file extensions */
	FileExtensions = 'FileExtensions',
	/** validate uploaded files in server with parser, parser must implement "validate-files" command */
	Parser = 'Parser',
}

/**
 * The validation mode for the upload form
 * @example
 * // No validation, allow uploading any folder or files
 * validate = { validate: ValidationMode.None }
 * // Only allow files with specific file extensions
 * validate = { validate: ValidationMode.FileExtensions, acceptedExtensions: ['txt', 'png', 'jpg'] }
 * // The parser has implemented the 'validate-files' command and will validate the folder of files
 * validate = { validate: ValidationMode.Parser }
 */
export type UploadValidation =
	| { validate: ValidationMode.None | ValidationMode.Parser }
	| { validate: ValidationMode.FileExtensions; acceptedExtensions: string[] };

export interface FileDisplay {
	/**
	 * Whether the names of the servers inferred from the uploaded files are editable
	 * A user may want to change the name of a server to something more descriptive
	 */
	editable: boolean;
}
