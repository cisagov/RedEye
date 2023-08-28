[@redeye/parser-core](../index.md) / ParserImage

# Interface: ParserImage

## Table of contents

### Properties

- [fileName](ParserImage.md#filename)
- [filePath](ParserImage.md#filepath)
- [fileType](ParserImage.md#filetype)

## Properties

### fileName

• `Optional` **fileName**: `string`

The name of the image if the local file name is different from the name of the image

**`Example`**

```ts
name = 'host-desktop-screenshot.png';
```

#### Defined in

[parser-beacon.ts:116](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L116)

---

### filePath

• **filePath**: `string`

Path to the image that RedEye can access

**`Example`**

```ts
filePath = '<directory-of-parser>/images/image.png';
```

#### Defined in

[parser-beacon.ts:110](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L110)

---

### fileType

• **fileType**: `string`

The type of image

**`Example`**

```ts
type = 'png';
```

#### Defined in

[parser-beacon.ts:104](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L104)
