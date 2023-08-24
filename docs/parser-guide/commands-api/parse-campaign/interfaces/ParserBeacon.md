[@redeye/parser-core](../index.md) / ParserBeacon

# Interface: ParserBeacon

## Table of contents

### Properties

- [endTime](ParserBeacon.md#endtime)
- [files](ParserBeacon.md#files)
- [host](ParserBeacon.md#host)
- [images](ParserBeacon.md#images)
- [ip](ParserBeacon.md#ip)
- [name](ParserBeacon.md#name)
- [port](ParserBeacon.md#port)
- [process](ParserBeacon.md#process)
- [processId](ParserBeacon.md#processid)
- [server](ParserBeacon.md#server)
- [startTime](ParserBeacon.md#starttime)
- [type](ParserBeacon.md#type)

## Properties

### endTime

• `Optional` **endTime**: `Date`

The date time the beacon ran it's last command or was terminated

**`Example`**

```ts
endTime = new Date('2021-01-01T00:00:00.000Z');
```

#### Defined in

[parser-beacon.ts:66](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L66)

---

### files

• `Optional` **files**: [`ParserFile`](ParserFile.md)[]

A list of files that the beacon has uploaded or downloaded

**`Example`**

```ts
files = [
	{
		filePath: 'local/path/to/file.txt',
		fileName: 'admin-list.txt',
		dateTime: new Date("2021-01-01T00:00:00.000Z"),
		md5: '1234567890abcdef1234567890abcdef',
		fileFlag: 'UPLOAD'
		// or
		fileFlag: 'DOWNLOAD'
	}
]
```

#### Defined in

[parser-beacon.ts:94](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L94)

---

### host

• **host**: `string`

The name of the host that this beacon is running on
This should match the name of a host in the hosts object

**`Example`**

```ts
host = 'DESKTOP-12345';
```

#### Defined in

[parser-beacon.ts:19](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L19)

---

### images

• `Optional` **images**: [`ParserImage`](ParserImage.md)[]

A list of images that the beacon has downloaded

**`Example`**

```ts
images = [
	{
		fileType: 'png',
		filePath: 'local/path/to/image.png',
		fileName: 'host-desktop-screenshot.png',
	},
];
```

#### Defined in

[parser-beacon.ts:78](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L78)

---

### ip

• `Optional` **ip**: `string`

The IP address of the host as reported by the beacon

**`Example`**

```ts
ip = '192.168.23.3';
```

#### Defined in

[parser-beacon.ts:25](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L25)

---

### name

• **name**: `string`

The name of the beacon

#### Defined in

[parser-beacon.ts:7](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L7)

---

### port

• `Optional` **port**: `number`

The port that the beacon is communicating over

**`Example`**

```ts
// http
port = 80;
// https
port = 443;
```

#### Defined in

[parser-beacon.ts:42](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L42)

---

### process

• `Optional` **process**: `string`

The process name of the beacon

**`Example`**

```ts
process = 'explorer.exe';
```

#### Defined in

[parser-beacon.ts:48](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L48)

---

### processId

• `Optional` **processId**: `number`

The process identifier of the beacon

**`Example`**

```ts
pid = 1234;
```

#### Defined in

[parser-beacon.ts:54](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L54)

---

### server

• **server**: `string`

The name of the server that spawned this beacon
This should match the name of a server in the servers object

#### Defined in

[parser-beacon.ts:12](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L12)

---

### startTime

• `Optional` **startTime**: `Date`

The date time the beacon was initialized or ran it's first command

**`Example`**

```ts
startTime = new Date('2021-01-01T00:00:00.000Z');
```

#### Defined in

[parser-beacon.ts:60](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L60)

---

### type

• `Optional` **type**: `"http"` \| `"https"` \| `"smb"` \| `"dns"`

The type of beacon

**`Example`**

```ts
possible values: 'http' | 'https' | 'smb' | 'dns'
type = 'http'
```

#### Defined in

[parser-beacon.ts:33](https://github.com/cisagov/RedEye/blob/bd5dfc45/parsers/parser-core/src/parser-output/parser-beacon.ts#L33)
