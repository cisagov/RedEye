@redeye/parser-core

# @redeye/parser-core

## Table of contents

### Enumerations

- [ServerDelineationTypes](enums/ServerDelineationTypes.md)
- [UploadType](enums/UploadType.md)
- [ValidationMode](enums/ValidationMode.md)

### Interfaces

- [FileDisplay](interfaces/FileDisplay.md)
- [FileUpload](interfaces/FileUpload.md)
- [ParserInfo](interfaces/ParserInfo.md)
- [UploadForm](interfaces/UploadForm.md)

### Type Aliases

- [UploadValidation](index.md#uploadvalidation)

## Type Aliases

### UploadValidation

Ƭ **UploadValidation**: { `validate`: [`None`](enums/ValidationMode.md#none) \| [`Parser`](enums/ValidationMode.md#parser) } \| { `acceptedExtensions`: `string`[] ; `validate`: [`FileExtensions`](enums/ValidationMode.md#fileextensions) }

The validation mode for the upload form

**`Example`**

```ts
// No validation, allow uploading any folder or files
validate = { validate: ValidationMode.None };
// Only allow files with specific file extensions
validate = { validate: ValidationMode.FileExtensions, acceptedExtensions: ['txt', 'png', 'jpg'] };
// The parser has implemented the 'validate-files' command and will validate the folder of files
validate = { validate: ValidationMode.Parser };
```

#### Defined in

[upload-form.ts:76](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L76)
