import { CommandGroupResolvers } from './command-group-resolvers';
import { OperatorResolvers } from './operator-resolvers';
import type { NonEmptyArray } from 'type-graphql';
import { AnnotationResolvers } from './annotation-resolvers';
import { CampaignResolvers } from './campaign-resolvers';
import { BeaconResolvers } from './beacon-resolvers';
import { CommandResolvers, CommandTypeCountResolvers } from './command-resolvers';
import { FileResolvers } from './file-resolvers';
import { HostResolvers } from './host-resolvers';
import { ImageResolvers } from './image-resolvers';
import { LinksResolvers } from './links-resolvers';
import { LogResolvers } from './log-resolvers';
import { PresentationResolvers } from './presentation-resolvers';
import { ProgressResolvers } from './progress-resolvers';
import { ServerResolvers } from './server-resolvers';
import { TimelineResolvers } from './timeline-resolvers';
import { ParserResolvers } from './parser-resolvers';

// eslint-disable-next-line @typescript-eslint/ban-types
export const resolvers: NonEmptyArray<Function> = [
	AnnotationResolvers,
	BeaconResolvers,
	CampaignResolvers,
	CommandResolvers,
	CommandGroupResolvers,
	CommandTypeCountResolvers,
	FileResolvers,
	HostResolvers,
	ImageResolvers,
	LinksResolvers,
	LogResolvers,
	OperatorResolvers,
	ParserResolvers,
	PresentationResolvers,
	ProgressResolvers,
	ServerResolvers,
	TimelineResolvers,
];
