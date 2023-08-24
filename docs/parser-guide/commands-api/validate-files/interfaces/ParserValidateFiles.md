[@redeye/parser-core](../index.md) / ParserValidateFiles

# Interface: ParserValidateFiles

## Table of contents

### Properties

- [invalid](ParserValidateFiles.md#invalid)
- [servers](ParserValidateFiles.md#servers)
- [valid](ParserValidateFiles.md#valid)

## Properties

### invalid

• **invalid**: `string`[]

An array of invalid file paths relative to the campaign root directory

**`Example`**

```ts
invalid = ['/campaign/server-1/file3.jpg', '/campaign/server-1/file4.xml'];
```

#### Defined in

[parser-validate-files.ts:22](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-validate-files.ts#L22)

---

### servers

• **servers**: { `fileCount?`: `number` ; `name`: `string` }[]

A list of servers and the number of files associated with each server

**`Example`**

```ts
servers = [
	{ name: 'server1', fileCount: 2 },
	{ name: 'server2', fileCount: 1 },
];
```

#### Defined in

[parser-validate-files.ts:10](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-validate-files.ts#L10)

---

### valid

• **valid**: `string`[]

An array of valid file paths relative to the campaign root directory

**`Example`**

```ts
valid = ['/campaign/server-1/file1.json', '/campaign/server-1/file2.json'];
```

#### Defined in

[parser-validate-files.ts:16](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-validate-files.ts#L16)
