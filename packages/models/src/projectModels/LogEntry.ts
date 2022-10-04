import { Property, PrimaryKey, Entity, ManyToOne, OneToOne } from '@mikro-orm/core';
import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Beacon } from './Beacon';
import { Command } from './Command';
import { randomUUID } from 'crypto';
import { BeaconMeta } from './BeaconMeta';

/**
 * Notes on each log line type taken from the (Cobalt Strike Blog)[https://blog.cobaltstrike.com/2016/06/29/who-let-the-logs-out-woof/]
 * */
export enum BeaconLineType {
	/**
	 * The metadata entry provides information about the session. This information is usually found at the top of a Beacon log file. Consult this entry to see who the session ran as, which process it lived in, the computer name, and IP address of the target.
	 */
	METADATA = 'METADATA',
	/**
	 * The input entry indicates that a command was issued. The log includes the command, its arguments, and the operator that issued the command.
	 */
	INPUT = 'INPUT',
	/**
	 * The task entry is Cobalt Strike’s acknowledgement of input. This information shows you how Cobalt Strike interpreted the command given to it. These entries make a great running narrative of what happened in a Beacon session. In fact, I use this information quite heavily in Cobalt Strike’s reports.
	 */
	TASK = 'TASK',
	/**
	 * The checkin entry documents when Beacon called home to grab tasks that were in its queue. This is helpful if you need to approximate when a queued command was run.
	 */
	CHECKIN = 'CHECKIN',
	/**
	 * The output entry is the output of a command or action taken with Beacon.
	 */
	OUTPUT = 'OUTPUT',
	MODE = 'MODE',
	ERROR = 'ERROR',
	INDICATOR = 'INDICATOR',
}

export enum LogType {
	BEACON = 'BEACON',
	EVENT = 'EVENT',
	DOWNLOAD = 'DOWNLOAD',
	WEBLOG = 'WEBLOG',
	KEYSTROKES = 'KEYSTROKES',
	UNKNOWN = 'UNKNOWN',
}

registerEnumType(BeaconLineType, {
	name: 'BeaconLineType',
	description: 'The type of line in a beacon log',
});

registerEnumType(LogType, {
	name: 'LogType',
	description: 'Basic Log Types based on the filename',
});

@ObjectType()
@Entity()
export class LogEntry {
	constructor(obj: Omit<LogEntry, 'id' | 'pushLogLine'>) {
		const { lineType, blob, logType, filepath, lineNumber, ...others } = obj;
		if (!this.id) this.id = randomUUID();
		this.blob = sanitizeBadCharacters(blob);
		this.filepath = filepath;
		(this.lineType = logType === LogType.BEACON ? lineType : undefined), (this.logType = logType);
		this.lineNumber = lineNumber;
		Object.assign(this, {
			...others,
		});
	}

	@Field(() => String)
	@PrimaryKey()
	id!: string;

	@Field(() => String, { description: 'All lines in a LogEntry' })
	@Property()
	blob: string;

	pushLogLine(line: string) {
		this.blob += sanitizeBadCharacters(line) + '\n';
	}

	@Field(() => String)
	@Property({ nullable: true })
	filepath: string;

	@Field(() => Number)
	@Property()
	lineNumber: number;

	@Field((_type) => BeaconLineType, { nullable: true })
	@Property({ nullable: true, type: 'string' })
	lineType?: BeaconLineType;

	@Field((_type) => LogType)
	@Property({ type: 'string' })
	logType: LogType;

	@Field(() => Date, { nullable: true })
	@Property({ nullable: true })
	dateTime?: Date;

	/**
	 * Relationships
	 */

	@OneToOne({ entity: () => BeaconMeta, nullable: true, onDelete: 'cascade' })
	beaconMeta?: BeaconMeta;

	@Field(() => Beacon, { nullable: true })
	@ManyToOne(() => Beacon, { nullable: true, onDelete: 'cascade' })
	beacon?: Beacon;

	@Field(() => Command, { nullable: true })
	@ManyToOne(() => Command, { nullable: true, onDelete: 'cascade' })
	command?: Command;
}

export function sanitizeBadCharacters(string: string): string {
	// eslint-disable-next-line no-control-regex
	return string.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u0019\u007F]+/g, '');
}
