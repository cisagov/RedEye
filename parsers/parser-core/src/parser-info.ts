export enum ValidationMode {
	/** no validation */
	None = 'None',
	/** validate uploaded files in client by file extensions */
	FileExtensions = 'FileExtensions',
	/** validate uploaded files in server with parser, parser must implement "validate" command */
	Parser = 'Parser',
}

export enum UploadType {
	/** upload a single file or a selection of multiple files */
	File = 'File',
	/** upload a directory */
	Directory = 'Directory',
}

type UploadValidation =
	| { validate: ValidationMode.None | ValidationMode.Parser }
	| { validate: ValidationMode.FileExtensions; acceptedExtensions: string[] };

interface FileUpload {
	/** The type of upload, a selection of files or a directory */
	type: keyof typeof UploadType;
	/** Describes what should be uploaded for the selected parser */
	description: string;
	/** A string that will be displayed in the upload form as an example of the type of file or shape of directory to upload */
	example?: string;
}

interface FileDisplay {
	/**
	 * Whether the names of the servers inferred from the uploaded files are editable
	 * A user may want to change the name of a server to something more descriptive
	 */
	editable: boolean;
}

export interface UploadForm {
	/** The title of the tab in the upload form */
	tabTitle: string;
	/**
	 * Whether the parser is enabled in blue team mode
	 * This should be false unless the parser is intended to be used by a blue team
	 * The Blue team mode is intended to be a read only mode
	 * */
	enabledInBlueTeam: boolean;
	/** The type of server delineation used by the parser */
	serverDelineation: keyof typeof ServerDelineationTypes;
	/** An object that configures the file upload portion of the upload form */
	fileUpload: FileUpload & UploadValidation;
	/** An object that configures the display of servers/files after upload */
	fileDisplay: FileDisplay;
}

export enum ServerDelineationTypes {
	/** server data seperated into distinct folders */
	Folder = 'Folder',
	/** server data not in any particular file/folder structure */
	Database = 'Database',
}

export interface ParserInfo {
	/** The version of the RedEye parser config that the parser is compatible with */
	version: number;
	/** ID for parser, should match the standard name of the binary file or command */
	id: string;
	/** The display name of the parser */
	name: string;
	/** An optional description of the parser */
	description?: string;
	/** An object that configures the upload form */
	uploadForm: UploadForm;
}
