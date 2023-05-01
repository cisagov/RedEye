import { semanticIcons } from '@redeye/client/components';
import {
	OverviewCommentList,
	presentationCommandGroupModelPrimitives,
	presentationItemModelPrimitives,
	useStore,
} from '@redeye/client/store';
import { FlexSplitter } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { InfoRow, RowTitle, IconLabel } from '../../components';

type CommentListProps = {
	setCommandGroupIds: (groupIDs: string[]) => void;
};

export const OverviewComments = observer<CommentListProps>(({ setCommandGroupIds }) => {
	const store = useStore();
	const { data } = useQuery(
		['presentation-items', store.campaign.id],
		async () =>
			await store.graphqlStore.queryPresentationItems(
				{ campaignId: store.campaign.id!, hidden: store.settings.showHidden },
				presentationItemModelPrimitives.commandGroups(presentationCommandGroupModelPrimitives).toString(),
				undefined,
				true
			)
	);

	return (
		<>
			{data?.presentationItems?.map((presentationItem, i) => (
				<InfoRow
					key={presentationItem.id}
					onClick={() => {
						setCommandGroupIds(presentationItem.commandGroupIds);
						store.campaign.setOverviewCommentList(OverviewCommentList.COMMENTS);
					}}
				>
					<RowTitle bold={i < 2}>{presentationItem.key}</RowTitle>
					<FlexSplitter />
					<IconLabel title="Commands" value={presentationItem.commandCount} icon={semanticIcons.commands} />
					<IconLabel title="comments" value={presentationItem.count} icon={semanticIcons.comment} />
				</InfoRow>
			))}
		</>
	);
});
