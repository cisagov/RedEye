[@redeye/parser-core](../index.md) / ParserHost

# Interface: ParserHost

## Table of contents

### Properties

- [ip](ParserHost.md#ip)
- [name](ParserHost.md#name)
- [os](ParserHost.md#os)
- [osVersion](ParserHost.md#osversion)
- [server](ParserHost.md#server)
- [type](ParserHost.md#type)

## Properties

### ip

• `Optional` **ip**: `string`

The IP address of the host

**`Example`**

```ts
ip = '192.168.23.0';
```

#### Defined in

[parser-host.ts:28](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-host.ts#L28)

---

### name

• **name**: `string`

The name of the host

#### Defined in

[parser-host.ts:5](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-host.ts#L5)

---

### os

• `Optional` **os**: `string`

The operating system of the host

**`Example`**

```ts
os = 'Windows';
```

#### Defined in

[parser-host.ts:16](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-host.ts#L16)

---

### osVersion

• `Optional` **osVersion**: `string`

The version of the operating system of the host

**`Example`**

```ts
osVersion = '10.0.19041';
```

#### Defined in

[parser-host.ts:22](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-host.ts#L22)

---

### server

• **server**: `string`

The name of the server that first ran a command or spawned a beacon on the host
This should match the name of a server in the servers object

#### Defined in

[parser-host.ts:10](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-host.ts#L10)

---

### type

• `Optional` **type**: `string`

The type of host

**`Example`**

```ts
type = 'workstation';
type = 'server';
type = 'laptop';
type = 'virtual machine';
```

#### Defined in

[parser-host.ts:37](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-host.ts#L37)
