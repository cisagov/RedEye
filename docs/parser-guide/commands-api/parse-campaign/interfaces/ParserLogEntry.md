[@redeye/parser-core](../index.md) / ParserLogEntry

# Interface: ParserLogEntry

## Table of contents

### Properties

- [blob](ParserLogEntry.md#blob)
- [dateTime](ParserLogEntry.md#datetime)
- [filepath](ParserLogEntry.md#filepath)
- [lineNumber](ParserLogEntry.md#linenumber)
- [lineType](ParserLogEntry.md#linetype)
- [logType](ParserLogEntry.md#logtype)

## Properties

### blob

• **blob**: `string`

The text of the log entry, can be a command input or output

**`Example`**

```ts
blob = 'ls'
blob = 'cd C:\\Users\\admin\\Desktop'
blob = 'dir'
blob = '[System Process]\nsmss.exe\n...etc'
```

#### Defined in

[parser-log-entry.ts:12](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-log-entry.ts#L12)

___

### dateTime

• `Optional` **dateTime**: `Date`

The date and time the log entry was created

**`Example`**

```ts
dateTime = new Date('2021-01-01T00:00:00.000Z')
```

#### Defined in

[parser-log-entry.ts:66](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-log-entry.ts#L66)

___

### filepath

• `Optional` **filepath**: `string`

Local path to the file that the log entry was found in

**`Example`**

```ts
filepath = '<directory-of-parser>/logs/2023-02-01/log-1.txt'
```

#### Defined in

[parser-log-entry.ts:18](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-log-entry.ts#L18)

___

### lineNumber

• `Optional` **lineNumber**: `number`

The starting line number of the log entry in the file

**`Example`**

```ts
lineNumber = 123
```

#### Defined in

[parser-log-entry.ts:24](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-log-entry.ts#L24)

___

### lineType

• `Optional` **lineType**: ``"METADATA"`` \| ``"INPUT"`` \| ``"TASK"`` \| ``"CHECKIN"`` \| ``"OUTPUT"`` \| ``"MODE"`` \| ``"ERROR"`` \| ``"INDICATOR"``

The type of log line if the logType is 'BEACON'

**`Example`**

```ts
// If the log entry is a command input
logType = 'INPUT'
// If the log entry is a command output
logType = 'OUTPUT'
// If the log entry is a beacon status checkin with the server
logType = 'CHECKIN'
// If the log entry is the C2 server acknowledging a command
logType = 'TASK'
// If the log entry is an error of any kind
logType = 'ERROR'
// If the log entry is miscellaneous metadata tied to a beacon
logType = 'METADATA'
```

#### Defined in

[parser-log-entry.ts:42](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-log-entry.ts#L42)

___

### logType

• **logType**: ``"BEACON"`` \| ``"EVENT"`` \| ``"DOWNLOAD"`` \| ``"WEBLOG"`` \| ``"KEYSTROKES"`` \| ``"UNKNOWN"``

The type of log entry

**`Example`**

```ts
// A beacon log entry
logType = 'BEACON'
// Misc events on the C2 server (e.g. operator login)
logType = 'EVENT'
// A file download from a beacon
logType = 'DOWNLOAD'
// A web log entry from a beacon
logType = 'WEBLOG'
// A keystroke log entry from a beacon
logType = 'KEYSTROKES'
// Any other log entry
logType = 'UNKNOWN'
```

#### Defined in

[parser-log-entry.ts:60](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-log-entry.ts#L60)
