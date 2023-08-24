[@redeye/parser-core](../index.md) / FileUpload

# Interface: FileUpload

## Table of contents

### Properties

- [description](FileUpload.md#description)
- [example](FileUpload.md#example)
- [type](FileUpload.md#type)

## Properties

### description

• **description**: `string`

Describes what should be uploaded for the selected parser

**`Example`**

```ts
description =
	'Upload a directory of files that are organized by server name and date in the format: <FOLDER_TO_UPLOAD>/<SERVER_NAME>/<YYYYMMDD>/';
```

#### Defined in

[file-upload.ts:9](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/file-upload.ts#L9)

---

### example

• `Optional` **example**: `string`

A string that will be displayed in the upload form as an example of the type of file or shape of directory to upload

**`Default`**

```ts
undefined;
```

**`Example`**

```ts
`Campaign_Folder
- Server_Folder_1
  - 200101
  - 200102
  - 200103`;
```

#### Defined in

[file-upload.ts:20](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/file-upload.ts#L20)

---

### type

• **type**: `"File"` \| `"Directory"`

The type of upload, a selection of files or a directory

#### Defined in

[file-upload.ts:3](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/file-upload.ts#L3)
