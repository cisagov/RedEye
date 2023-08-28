[@redeye/parser-core](../index.md) / ValidationMode

# Enumeration: ValidationMode

## Table of contents

### Enumeration Members

- [FileExtensions](ValidationMode.md#fileextensions)
- [None](ValidationMode.md#none)
- [Parser](ValidationMode.md#parser)

## Enumeration Members

### FileExtensions

• **FileExtensions** = `"FileExtensions"`

validate uploaded files in client by file extensions

#### Defined in

[upload-form.ts:61](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L61)

---

### None

• **None** = `"None"`

no validation

#### Defined in

[upload-form.ts:59](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L59)

---

### Parser

• **Parser** = `"Parser"`

validate uploaded files in server with parser, parser must implement "validate-files" command

#### Defined in

[upload-form.ts:63](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-info/upload-form.ts#L63)
