[@redeye/parser-core](../index.md) / ParserFile

# Interface: ParserFile

## Table of contents

### Properties

- [dateTime](ParserFile.md#datetime)
- [fileFlag](ParserFile.md#fileflag)
- [fileName](ParserFile.md#filename)
- [filePath](ParserFile.md#filepath)
- [md5](ParserFile.md#md5)

## Properties

### dateTime

• **dateTime**: `Date`

The date time the file was created or modified

**`Example`**

```ts
dateTime = new Date('2021-01-01T00:00:00.000Z');
```

#### Defined in

[parser-beacon.ts:137](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L137)

---

### fileFlag

• **fileFlag**: `"DOWNLOAD"` \| `"UPLOAD"`

Was this file uploaded to the host or downloaded from the host

#### Defined in

[parser-beacon.ts:146](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L146)

---

### fileName

• `Optional` **fileName**: `string`

The name of the file if the local file name is different from the name of the file

**`Example`**

```ts
name = 'admin-list.txt';
```

#### Defined in

[parser-beacon.ts:125](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L125)

---

### filePath

• **filePath**: `string`

Path to the file that RedEye can access

**`Example`**

```ts
filePath = '<directory-of-parser>/files/file.txt';
```

#### Defined in

[parser-beacon.ts:131](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L131)

---

### md5

• `Optional` **md5**: `string`

The MD5 hash of the file

#### Defined in

[parser-beacon.ts:141](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L141)
