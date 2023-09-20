import type { UploadForm } from './upload-form';
export { UploadForm, UploadValidation, ServerDelineationTypes, ValidationMode, FileDisplay } from './upload-form';
export { FileUpload, UploadType } from './file-upload';
export interface ParserInfo {
	/**
	 * The version of the RedEye parser config that the parser is compatible with
	 * @example
	 * // RedEye parser schema was updated with new fields and commands, bumping from version 1 to 2
	 * version = 2
	 * // If you haven't updated your parser to use the new fields and commands, you can still use the old version
	 * version = 1
	 */
	version: number;
	/**
	 * ID for parser, should match the standard name of the binary file or command
	 * // The parser binary is named 'my-parser'
	 * id = 'my-parser'
	 */
	id: string;
	/**
	 * The display name of the parser
	 * @example
	 * // The parser binary is named 'my-parser'
	 * name = 'My Super Cool Parser'
	 */
	name: string;
	/**
	 * An optional description of the parser
	 * @example
	 * description = 'This parser is super cool and does all the things'
	 */
	description?: string;
	/**
	 * An object that configures the upload form in RedEye's UI
	 * @example
	 * // upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/
	 * uploadForm = {
	 * 	tabTitle: '<C2_NAME>',
	 * 		enabledInBlueTeam: false,
	 * 		serverDelineation: ServerDelineationTypes.Folder,
	 * 		fileUpload: {
	 * 			type: UploadType.Directory,
	 * 			description: 'Upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/',
	 * 			example: `Campaign_Folder
	 * 				- Server_Folder_1
	 * 					- 200101
	 * 					- 200102
	 * 					- 200103`,
	 * 			validate: ValidationMode.Parser
	 * 		},
	 * 		fileDisplay: {
	 * 			editable: true,
	 * 		}
	 * }
	 * */
	uploadForm: UploadForm;
}
