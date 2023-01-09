import {
	annotationModelPrimitives,
	beaconModelPrimitives,
	campaignModelPrimitives,
	commandGroupModelPrimitives,
	commandModelPrimitives,
	hostModelPrimitives,
	linkModelPrimitives,
	logEntryModelPrimitives,
	serverModelPrimitives,
	timelineModelPrimitives,
} from '../graphql';

export const annotationQuery = annotationModelPrimitives.tags((tag) => tag.text).toString();

export const commandQuery = commandModelPrimitives
	.beacon((beacon) => beacon.meta((meta) => meta.ip.pid.startTime.endTime).host((host) => host.beaconIds))
	.input((commandInput) => commandInput.dateTime.blob.logType)
	.commandGroups((cG) =>
		cG.annotations((anno) => anno.text.user.commandIds.commandGroupId.date.favorite.tags((tag) => tag.text))
	)
	// .link((link) => link.manual)
	.operator((operator) => operator)
	.output((log) => log.blob)
	.toString();

export const linkQuery = linkModelPrimitives
	.command((command) => command)
	.origin((or) => or.host((comp) => comp.cobaltStrikeServer))
	.destination((dest) => dest.host((comp) => comp.cobaltStrikeServer))
	.toString();

export const commandGroupQuery = commandGroupModelPrimitives
	.annotations((anno) => anno.text.user.commandIds.commandGroupId.date.favorite.tags((tag) => tag.text))
	.toString();

export const commandGroupCommentsQuery = commandGroupModelPrimitives
	.commands((command) =>
		command
			.beacon((beacon) => beacon.meta((meta) => meta.ip.pid.startTime.endTime).host((host) => host.beaconIds))
			.input((commandInput) => commandInput.dateTime.blob.logType)
			.operator((operator) => operator)
			.output((log) => log.blob)
	)
	.annotations((anno) => anno.text.user.commandIds.commandGroupId.date.favorite.tags((tag) => tag.text))
	.toString();

export const timelineQuery = timelineModelPrimitives
	.buckets((bucket) =>
		bucket.bucketStartTime.bucketEndTime.createdBeacons.activeBeacons.dyingBeacons.deadBeacons.createdLinks.activeLinks.dyingLinks.deadLinks.beaconCommandCountPair(
			(pair) => pair.commandCount.beaconId
		)
	)
	.toString();

export const serverQuery = serverModelPrimitives
	.beacons((beacon) => beacon.serverId)
	.meta((meta) => meta.type)
	.toString();

export const beaconQuery = beaconModelPrimitives
	.host((host) => host.displayName.cobaltStrikeServer.hostName)
	.meta((meta) => meta.username.ip.pid.startTime.endTime)
	.toString();

export const hostQuery = hostModelPrimitives.cobaltStrikeServer.beaconIds.meta((meta) => meta.os.ip).toString();

export const campaignsQuery = campaignModelPrimitives
	.lastOpenedBy((user) => user)
	.creator((user) => user)
	.toString();

export const rawLogOutputQuery = logEntryModelPrimitives;
