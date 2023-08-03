[@redeye/parser-core](../index.md) / ParserOperator

# Interface: ParserOperator

## Table of contents

### Properties

- [endTime](ParserOperator.md#endtime)
- [name](ParserOperator.md#name)
- [startTime](ParserOperator.md#starttime)

## Properties

### endTime

• `Optional` **endTime**: `Date`

The date and time the operator last sent a command

**`Example`**

```ts
// If the operator is still active
endTime = new Date()
// If the operator has never sent a command
endTime = undefined
// If the operator is no longer active
endTime = new Date('<date of last command>')
```

#### Defined in

[parser-operator.ts:22](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-operator.ts#L22)

___

### name

• **name**: `string`

The name of the operator

#### Defined in

[parser-operator.ts:5](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-operator.ts#L5)

___

### startTime

• `Optional` **startTime**: `Date`

The date and time the operator first sent a command

**`Example`**

```ts
startTime = new Date('<date of first command>')
```

#### Defined in

[parser-operator.ts:11](https://github.com/cisagov/RedEye/blob/9f9475cf/parsers/parser-core/src/parser-output/parser-operator.ts#L11)
