[@redeye/parser-core](../index.md) / UploadForm

# Interface: UploadForm

## Table of contents

### Properties

- [enabledInBlueTeam](UploadForm.md#enabledinblueteam)
- [fileDisplay](UploadForm.md#filedisplay)
- [fileUpload](UploadForm.md#fileupload)
- [serverDelineation](UploadForm.md#serverdelineation)
- [tabTitle](UploadForm.md#tabtitle)

## Properties

### enabledInBlueTeam

• **enabledInBlueTeam**: `boolean`

Whether the parser is enabled in blue team mode
This should be false unless the parser is intended to be used by a blue team
The Blue team mode is intended to be a read only mode

#### Defined in

[upload-form.ts:15](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L15)

---

### fileDisplay

• **fileDisplay**: [`FileDisplay`](FileDisplay.md)

An object that configures the list of servers/files after upload

**`Example`**

```ts
// server names are editable
fileDisplay = { editable: true };
```

#### Defined in

[upload-form.ts:47](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L47)

---

### fileUpload

• **fileUpload**: `Object`

An object that configures the file upload portion of the upload form

**`Example`**

```ts
// upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/
fileUpload = {
	type: UploadType.Directory,
	description:
		'Upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/',
	example: `Campaign_Folder
		- Server_Folder_1
			- 200101
			- 200102
			- 200103`,
	validate: ValidationMode.Parser,
};
```

#### Defined in

[upload-form.ts:40](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L40)

---

### serverDelineation

• **serverDelineation**: `"Folder"` \| `"Database"`

The type of server delineation used by the parser

**`Example`**

```ts
// server data is seperated into distinct folders like 'CAMPAIGN_FOLDER/SERVER_FOLDER/DATE_FOLDER'
serverDelineation = ServerDelineationTypes.Folder;
// server data is not in any particular file/folder structure
serverDelineation = ServerDelineationTypes.Database;
```

#### Defined in

[upload-form.ts:24](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L24)

---

### tabTitle

• **tabTitle**: `string`

The title of the tab in the upload form

**`Example`**

```ts
tabTitle = '<C2_NAME>';
```

#### Defined in

[upload-form.ts:9](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L9)
