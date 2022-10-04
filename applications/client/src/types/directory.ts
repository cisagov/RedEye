import type { InputHTMLAttributes } from 'react';

export interface DirectoryFile extends File {
	name: string;
	type: string;
	webkitRelativePath: string;
	blob: Blob;
	path?: string[];
}

export interface DirectoryFileList extends FileList {
	item(index: number): DirectoryFile | null;
	[index: number]: DirectoryFile;
}

export interface DirectoryInput extends InputHTMLAttributes<HTMLInputElement> {
	webkitdirectory: string;
	directory: string;
	type: 'file';
	mozdirectory: string;
}

export interface DirectoryTree {
	[key: string]: DirectoryTree | DirectoryFile;
}

export enum DirectorWorkerType {
	FILES,
	SERVER_FILES,
	FINISHED,
}
