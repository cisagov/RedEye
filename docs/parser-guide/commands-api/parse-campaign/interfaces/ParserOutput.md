[@redeye/parser-core](../index.md) / ParserOutput

# Interface: ParserOutput

## Table of contents

### Properties

- [beacons](ParserOutput.md#beacons)
- [commands](ParserOutput.md#commands)
- [hosts](ParserOutput.md#hosts)
- [links](ParserOutput.md#links)
- [operators](ParserOutput.md#operators)
- [servers](ParserOutput.md#servers)

## Properties

### beacons

• **beacons**: `Object`

A key-value pair of beacon names and their metadata

**`Example`**

```ts
// If the beacon 'beacon1' was created from server 'server1' on host 'DESKTOP-312' at 2021-01-01T00:00:00 and last checked in at 2021-02-02T00:00:02
beacons = {
"beacon1": {
		name: "beacon1",
		server: "server1",
		host: "DESKTOP-312",
		ip: "192.168.23.2",
		process: "svchost.exe",
		pid: 1234,
		startTime: new Date('2021-01-01T00:00:00.000Z'),
		endTime: new Date('2021-02-02T00:00:02.000Z')
	}
}
```

#### Index signature

▪ [beaconName: `string`]: [`ParserBeacon`](ParserBeacon.md)

#### Defined in

[index.ts:62](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/index.ts#L62)

___

### commands

• **commands**: `Object`

A key-value pair of unique command identifiers and commands with inputs and outputs, sent by operators to beacons

**`Example`**

```ts
// If the operator 'admin' sent a command to the beacon 'beacon1' at 2021-01-01T00:00:00
commands = {
  "admin-beacon1-2021-01-01T00:00:00": {
  	operator: "admin",
  	beacon: "beacon1",
  	input: {
  		blob: "shell whoami",
  		filepath: "C:\\Users\\admin\\Desktop\\command.txt",
  		lineNumber: 1,
  		logType: "BEACON"
  	},
  	output: {
  		blob: "admin",
  		filepath: "C:\\Users\\admin\\Desktop\\command.txt",
  		lineNumber: 2,
  		logType: "BEACON"
 	},
  	attackIds: ["T1033"]
  }
}
```

#### Index signature

▪ [commandName: `string`]: [`ParserCommand`](ParserCommand.md)

#### Defined in

[index.ts:106](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/index.ts#L106)

___

### hosts

• **hosts**: `Object`

A key-value pair of host names and their metadata

**`Example`**

```ts
// If the host 'DESKTOP-312' was first discovered or had a beacon spawned by server 'server1' with os 'Windows 10.0.19041'
hosts = {
"DESKTOP-312": {
			name: "DESKTOP-312",
			server: "server1",
			os: "Windows",
			osVersion: "10.0.19041",
			ip: '192.168.23.2',
	  	type: 'desktop',
	  }
	}
```

#### Index signature

▪ [hostName: `string`]: [`ParserHost`](ParserHost.md)

#### Defined in

[index.ts:41](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/index.ts#L41)

___

### links

• **links**: `Object`

A key-value pair of '<from>-<to>' and links from servers to beacons and beacons to beacons

**`Example`**

```ts
// If the server 'server1' has a beacon named 'beacon1'
links = {
	"server1-beacon1": {
		from: "server1",
		to: "beacon1"
		}
	}
```

#### Index signature

▪ [linkName: `string`]: [`ParserLink`](ParserLink.md)

#### Defined in

[index.ts:120](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/index.ts#L120)

___

### operators

• **operators**: `Object`

A key-value pair of operator names and the time range of their first and last command

**`Example`**

```ts
// If the operator 'admin' their first command at 2021-01-01T00:00:00 and last command at 2021-02-02T00:00:02
operators = {
 "admin": {
 		name: "admin",
 		startTime: new Date('2021-01-01T00:00:00.000Z'),
 		endTime: new Date('2021-02-02T00:00:02.000Z'),
 	}
 }
```

#### Index signature

▪ [operatorName: `string`]: [`ParserOperator`](ParserOperator.md)

#### Defined in

[index.ts:78](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/index.ts#L78)

___

### servers

• **servers**: `Object`

A key-value pair of server names and their metadata

**`Example`**

```ts
// If a C2 server was create with name 'server1' and will be communicating over https
servers = {
"server1": {
		name: "server1",
		type: 'https',
	}
}
```

#### Index signature

▪ [serverName: `string`]: [`ParserServer`](ParserServer.md)

#### Defined in

[index.ts:22](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/index.ts#L22)
