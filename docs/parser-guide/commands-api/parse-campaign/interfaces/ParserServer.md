[@redeye/parser-core](../index.md) / ParserServer

# Interface: ParserServer

## Table of contents

### Properties

- [name](ParserServer.md#name)
- [type](ParserServer.md#type)

## Properties

### name

• **name**: `string`

The name of the server

#### Defined in

[parser-server.ts:7](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-server.ts#L7)

---

### type

• `Optional` **type**: `"http"` \| `"https"` \| `"smb"` \| `"dns"`

The type of server

**`Default`**

```ts
'http';
```

**`Example`**

```ts
type = 'https';
```

#### Defined in

[parser-server.ts:15](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-server.ts#L15)
