[@redeye/parser-core](../index.md) / ParserInfo

# Interface: ParserInfo

## Table of contents

### Properties

- [description](ParserInfo.md#description)
- [id](ParserInfo.md#id)
- [name](ParserInfo.md#name)
- [uploadForm](ParserInfo.md#uploadform)
- [version](ParserInfo.md#version)

## Properties

### description

• `Optional` **description**: `string`

An optional description of the parser

**`Example`**

```ts
description = 'This parser is super cool and does all the things';
```

#### Defined in

[index.ts:32](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/index.ts#L32)

---

### id

• **id**: `string`

ID for parser, should match the standard name of the binary file or command
// The parser binary is named 'my-parser'
id = 'my-parser'

#### Defined in

[index.ts:19](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/index.ts#L19)

---

### name

• **name**: `string`

The display name of the parser

**`Example`**

```ts
// The parser binary is named 'my-parser'
name = 'My Super Cool Parser';
```

#### Defined in

[index.ts:26](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/index.ts#L26)

---

### uploadForm

• **uploadForm**: [`UploadForm`](UploadForm.md)

An object that configures the upload form in RedEye's UI

**`Example`**

```ts
// upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/
uploadForm = {
	tabTitle: '<C2_NAME>',
	enabledInBlueTeam: false,
	serverDelineation: ServerDelineationTypes.Folder,
	fileUpload: {
		type: UploadType.Directory,
		description:
			'Upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/',
		example: `Campaign_Folder
				- Server_Folder_1
					- 200101
					- 200102
					- 200103`,
		validate: ValidationMode.Parser,
	},
	fileDisplay: {
		editable: true,
	},
};
```

#### Defined in

[index.ts:56](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/index.ts#L56)

---

### version

• **version**: `number`

The version of the RedEye parser config that the parser is compatible with

**`Example`**

```ts
// RedEye parser schema was updated with new fields and commands, bumping from version 1 to 2
version = 2;
// If you haven't updated your parser to use the new fields and commands, you can still use the old version
version = 1;
```

#### Defined in

[index.ts:13](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/index.ts#L13)
