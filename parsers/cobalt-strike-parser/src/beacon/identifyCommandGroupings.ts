import type { LogEntry } from '@redeye/models';
import { BeaconLineType } from '@redeye/models';
import type { LogFilterMethod, ParsingRuleTuple } from './commandOutputMapping';
import { findParsingRules, isGreedyRule, isNeedyRule } from './commandOutputMapping';

export type InternalCommand = {
	input: LogEntry;
	output: LogEntry[];
};

const filterToInputEntries = (entries: LogEntry[]) => {
	return entries.filter(
		(entry) =>
			entry.lineType === BeaconLineType.TASK ||
			entry.lineType === BeaconLineType.INPUT ||
			entry.lineType === BeaconLineType.ERROR ||
			entry.lineType === BeaconLineType.INDICATOR
	);
};

// Returns matches to the rule and modifies the input array to remove matched elements
const needyGreedySearchAndSplice = (logLines: LogEntry[], rule: LogFilterMethod): LogEntry[] => {
	const searchResultIndexes: number[] = [];
	const searchResults: LogEntry[] = [];
	logLines.forEach((logLine, i, logLines) => {
		if (rule(logLine, logLines)) searchResultIndexes.push(i - searchResultIndexes.length);
	});

	searchResultIndexes.forEach((resultIndex) => {
		searchResults.push(...logLines.splice(resultIndex, 1));
	});

	return searchResults;
};

const identifyCommandGroupingsOnTuplesWithOutputs = (
	commandTuples: ParsingRuleTuple[],
	logEntries: LogEntry[],
	commands: InternalCommand[]
) => {
	if (commandTuples.length > 0) {
		// Find the next input index
		const nextInputIndex = logEntries.findIndex((entry) => entry.lineType === BeaconLineType.INPUT);
		// Splice out all logs until the next input or the rest of the file
		const unfilteredOutputStack =
			nextInputIndex === -1 ? logEntries.splice(0, logEntries.length) : logEntries.splice(0, nextInputIndex);

		// From the potential outputs, remove metadata and checking lines
		const outputStack = unfilteredOutputStack.filter((entry) => {
			if (entry.lineType === BeaconLineType.METADATA || entry.lineType === BeaconLineType.CHECKIN) {
				return false;
			}
			return true;
		});

		// First pass: resolve and remove commands with an output of 1 line starting from the beginning
		while (commandTuples.length > 0) {
			const currentTuple = commandTuples[0];
			const [command, currentRule] = currentTuple;
			if (currentRule.lines === 1) {
				// get the first log line available from the output stack
				const output = outputStack.shift();
				// remove the tuple from the command stack so it isn't reused
				commandTuples.shift();
				if (output) command.output.push(output);
				// It may seem like it's an error if output isn't defined but it's very possible that a command was sent to a beacon that no longer could be communicated with
				commands.push(command);
			} else if (isNeedyRule(currentRule)) {
				const foundNeedyLogs = needyGreedySearchAndSplice(outputStack, currentRule.filterMethod);
				// remove the tuple from the command stack so it isn't reused
				commandTuples.shift();
				command.output.push(...foundNeedyLogs);
				commands.push(command);
			} else {
				// First element requires more than 1 line or doesn't have a special parsing rule, we can no longer make progress with this strategy
				break;
			}
		}

		// Second pass: resolve and remove commands with an output of 1 line starting from the end
		while (commandTuples.length > 0) {
			const lastCommandIndex = commandTuples.length - 1;
			const currentTuple = commandTuples[lastCommandIndex];
			const [command, rule] = currentTuple;
			if (rule.lines === 1) {
				// remove the tuple from the command stack so it isn't reused
				commandTuples.pop();
				const output = outputStack.pop();
				if (output) command.output.push(output);
				// It may seem like it's an error if output isn't defined but it's very possible that a command was sent to a beacon that no longer could be communicated with
				commands.push(command);
			} else if (isNeedyRule(currentTuple[1])) {
				const foundNeedyLogs = needyGreedySearchAndSplice(outputStack, currentTuple[1].filterMethod);
				// remove the tuple from the command stack so it isn't reused
				commandTuples.pop();
				command.output.push(...foundNeedyLogs);
				commands.push(command);
			} else {
				// Last element requires more than 1 line or doesn't have a special parsing rule, we can no longer make progress with this strategy
				break;
			}
		}

		// Final passes
		if (commandTuples.length === 1) {
			// Assume all remaining outputs belong to the command since there is nothing else left in the stack
			const [command] = commandTuples[0];
			commandTuples.shift();
			command.output.push(...outputStack);
			commands.push(command);
		} else if (commandTuples.length > 1) {
			// TODO: Try to make this smarter or at least associate potential outputs with remaining commands
			// ! For now we are absolutely giving up on the remaining commands
			const remainingCommands = commandTuples.map((tuple) => tuple[0]);
			commands.push(...remainingCommands);
			outputStack.splice(0, outputStack.length - 1);
		}
	}
};

const processInputStack = (commandInputStack: LogEntry[], logEntries: LogEntry[], commands: InternalCommand[]) => {
	const inputSets = filterToInputEntries(commandInputStack);

	// Create the command object for each input found and add it to a stack
	const newCommands: InternalCommand[] = [];
	inputSets.forEach((entry) => {
		// if the entry is an input, create a new element in the command stack. Otherwise, assume it belongs to the last command run
		if (entry.lineType === BeaconLineType.INPUT) {
			newCommands.push({ input: entry, output: [] });
		} else {
			const lastInput = newCommands[newCommands.length - 1];
			if (lastInput) lastInput.output.push(entry);
			// If we've yet to create to command and we don't have an input, it could belong to any command ever run on the beacon, ignore it until we have a long term solution
		}
	});

	const parsingRuleTuple = findParsingRules(newCommands);

	// Remove all commands that don't have outputs from the command stack
	const commandsWithPotentialGreedyOutput = parsingRuleTuple.filter(([command, rule]) => {
		if (rule.lines === 0) {
			commands.push(command);
			return false;
		} else return true;
	});

	// Remove greedy commands from the stack and associate their outputs, returns command that require outputs
	const commandsWithOutputTuple = commandsWithPotentialGreedyOutput.filter(([command, rule]) => {
		if (isGreedyRule(rule)) {
			const greedySearchResults = needyGreedySearchAndSplice(logEntries, rule.filterMethod);
			command.output.push(...greedySearchResults);
			commands.push(command);
			return false;
		} else return true;
	});

	identifyCommandGroupingsOnTuplesWithOutputs(commandsWithOutputTuple, logEntries, commands);
};

// immutableEntries is assumed to already time sorted upon query
export const identifyCommandGroupings = (immutableEntries: LogEntry[]): InternalCommand[] => {
	const commands: InternalCommand[] = [];

	// prevent the original array from being manipulated
	const logEntries = [...immutableEntries];

	while (logEntries.length) {
		// command stacks inputs are separated from their outputs by a check-in line
		const nextCheckinIndex = logEntries.findIndex((entry) => entry.lineType === BeaconLineType.CHECKIN);
		if (nextCheckinIndex !== -1) {
			// Get all possible inputs
			const commandInputStack = logEntries.splice(0, nextCheckinIndex + 1);
			processInputStack(commandInputStack, logEntries, commands);
		} else {
			processInputStack(logEntries, [], commands);
			break;
		}
	}
	return commands;
};
