// Project Models
import { Annotation } from './Annotation';
import { Beacon } from './Beacon';
import { BeaconMeta, BeaconType } from './BeaconMeta';
import { Command } from './Command';
import { CommandGroup } from './CommandGroup';
import { File, FileFlag } from './File';
import { Host } from './Host';
import { HostMeta } from './HostMeta';
import { Image } from './Image';
import { LogEntry, LogType, BeaconLineType } from './LogEntry';
import { Link } from './Link';
import { mitreTechniques, MitreTechniques } from './MitreTechniques';
import { Operator } from './Operator';
import { ParsingProgress, ServerParsingProgress } from './Progress';
import { Server } from './Server';
import { ServerMeta, ServerType } from './ServerMeta';
import { Tag } from './Tag';
import { Timeline, TimelineBucket, TimelineCommandCountTuple } from './Timeline';
import { GenerationType, Shapes } from './shared';

export const campaignEntities = [
	Annotation,
	Beacon,
	BeaconMeta,
	Command,
	CommandGroup,
	File,
	Host,
	HostMeta,
	Image,
	Link,
	LogEntry,
	Operator,
	ParsingProgress,
	ServerParsingProgress,
	Server,
	ServerMeta,
	Tag,
	Timeline,
	TimelineBucket,
	TimelineCommandCountTuple,
];

export {
	// Project Models
	Annotation,
	Beacon,
	BeaconMeta,
	BeaconType,
	Command,
	CommandGroup,
	File,
	Host,
	HostMeta,
	Image,
	Link,
	LogEntry,
	Operator,
	ParsingProgress,
	ServerParsingProgress,
	Server,
	ServerMeta,
	Tag,
	Timeline,
	TimelineBucket,
	TimelineCommandCountTuple,
	// enum
	BeaconLineType,
	FileFlag,
	GenerationType,
	LogType,
	ServerType,
	Shapes,
	MitreTechniques,
	mitreTechniques,
};
