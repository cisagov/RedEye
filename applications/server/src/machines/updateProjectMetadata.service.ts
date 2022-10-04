import {
	Annotation,
	Beacon,
	Campaign,
	Command,
	Host,
	GlobalOperator,
	LogEntry,
	Operator,
	ParsingStatus,
	Server,
} from '@redeye/models';
import { connectToProjectEmOrFail, getMainEmOrFail } from '../store/utils/project-db';
import type { GraphQLContext, EndpointContext } from '../types';

export const updateProjectMetadata = async (
	campaignId: string,
	context: GraphQLContext | EndpointContext,
	failure: boolean = false
): Promise<void> => {
	const mainEm = getMainEmOrFail(context);
	const projectEm = await connectToProjectEmOrFail(campaignId, context);

	const computerCount = await projectEm.count(Host);
	const commandCount = await projectEm.count(Command);
	const annotationCount = await projectEm.count(Annotation);
	const bloodStrikeServerCount = await projectEm.count(Server);
	const beaconCount = await projectEm.count(Beacon);

	const allOperators = await mainEm.createQueryBuilder(GlobalOperator).getResultList();
	const campaignOperators = await projectEm.createQueryBuilder(Operator).getResultList();

	const allLogs = await projectEm.find(LogEntry, {});
	let firstDate: Date | undefined;
	let lastDate: Date | undefined;

	for (let i = 0; i < allLogs.length; i++) {
		const { dateTime } = allLogs[i];
		if (dateTime) {
			const date = new Date(dateTime);
			if (!firstDate && date) {
				firstDate = date;
				lastDate = date;
			} else if ((firstDate as Date) > date) {
				firstDate = date;
			} else if ((lastDate as Date) < date) {
				lastDate = date;
			}
		}
	}

	try {
		const allOperatorIds = allOperators.map((operator) => operator.id);
		const newOperators = campaignOperators.filter((campaignOperator) => !allOperatorIds.includes(campaignOperator.id));

		newOperators.forEach(({ id }) => {
			const newOperator = new GlobalOperator({ id });
			mainEm.persist(newOperator);
		});
	} catch {}

	try {
		const campaign = await mainEm.findOneOrFail(Campaign, campaignId);
		campaign.parsingStatus = failure ? ParsingStatus.PARSING_FAILURE : ParsingStatus.PARSING_COMPLETED;
		campaign.annotationCount = annotationCount;
		campaign.computerCount = computerCount - bloodStrikeServerCount;
		campaign.commandCount = commandCount;
		campaign.bloodStrikeServerCount = bloodStrikeServerCount;
		campaign.beaconCount = beaconCount;
		campaign.firstLogTime = firstDate;
		campaign.lastLogTime = lastDate;
	} catch {}
	await mainEm.flush();
};
