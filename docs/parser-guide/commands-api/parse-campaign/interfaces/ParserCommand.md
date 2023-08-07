[@redeye/parser-core](../index.md) / ParserCommand

# Interface: ParserCommand

## Table of contents

### Properties

- [attackIds](ParserCommand.md#attackids)
- [beacon](ParserCommand.md#beacon)
- [commandFailed](ParserCommand.md#commandfailed)
- [input](ParserCommand.md#input)
- [operator](ParserCommand.md#operator)
- [output](ParserCommand.md#output)

## Properties

### attackIds

• `Optional` **attackIds**: `string`[]

A list of the MITRE ATT&CK techniques used by the command

**`Default`**

```ts
[]
```

**`Example`**

```ts
attackIds = ['T1059', 'T1059.001']
```

#### Defined in

[parser-command.ts:68](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-command.ts#L68)

___

### beacon

• **beacon**: `string`

Name of the beacon that the command was run from
Should match the name of a beacon in the beacons object

**`Example`**

```ts
beacon = 'beacon1'
```

#### Defined in

[parser-command.ts:17](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-command.ts#L17)

___

### commandFailed

• `Optional` **commandFailed**: `boolean`

Whether the command was successful

**`Default`**

```ts
false
```

**`Example`**

```ts
// The command output was not found in the logs or the command failed
commandFailed = true
```

#### Defined in

[parser-command.ts:38](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-command.ts#L38)

___

### input

• **input**: [`ParserLogEntry`](ParserLogEntry.md)

The input that initialized the command

**`Example`**

```ts
input = {
 blob: 'ls',
 filepath: '<directory-of-parser>/logs/2023-02-01/log-1.txt',
 lineNumber: 123,
 logType: 'INPUT',
 dateTime: new Date("2021-01-01T00:00:00.000Z")
 }
```

#### Defined in

[parser-command.ts:30](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-command.ts#L30)

___

### operator

• `Optional` **operator**: `string`

Name of the operator that sent the command
Should match the name of an operator in the operators object

**`Example`**

```ts
operator = 'admin'
```

#### Defined in

[parser-command.ts:10](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-command.ts#L10)

___

### output

• `Optional` **output**: [`ParserLogEntry`](ParserLogEntry.md)

The output of the command

**`Example`**

```ts
// If the command was successful
output = {
	blob: '[System Process]\nsmss.exe\n...etc',
	filepath: '<directory-of-parser>/logs/2023-02-01/log-1.txt',
	lineNumber: 123,
	logType: 'OUTPUT',
	dateTime: new Date("2021-01-01T00:00:00.000Z")
}
// If the command failed
output = undefined
// or
output = {
		blob: 'Unknown command: pwd',
		filepath: '<directory-of-parser>/logs/2023-02-01/log-1.txt',
		lineNumber: 123,
		logType: 'ERROR',
		dateTime: new Date("2021-01-01T00:00:00.000Z")
	}
```

#### Defined in

[parser-command.ts:61](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-command.ts#L61)
