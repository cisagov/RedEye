import { CarbonIcon, semanticIcons } from '@redeye/client/components';
import {
	OverviewCommentList,
	presentationCommandGroupModelPrimitives,
	presentationItemModelPrimitives,
	useStore,
} from '@redeye/client/store';
import { FlexSplitter } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { Bookmark16 } from '@carbon/icons-react';
import { Hashtag, User, Strawberry } from '@carbon/icons-react/next';
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
					// eslint-disable-next-line react/no-array-index-key
					key={`${presentationItem.id}-${i}`}
					onClick={() => {
						setCommandGroupIds(presentationItem.commandGroupIds);
						store.campaign.setOverviewCommentList(OverviewCommentList.COMMENTS);
					}}
				>
					{presentationItem.id !== 'all' && <CarbonIcon icon={getIcon(presentationItem.id)} />}
					<RowTitle bold={['all', 'favorited'].includes(presentationItem.id)}>
						{presentationItem.key[0] === '#' ? presentationItem.key.slice(1) : presentationItem.key}
					</RowTitle>
					<FlexSplitter />
					<IconLabel title="Commands" value={presentationItem.commandCount} icon={semanticIcons.commands} />
					<IconLabel title="comments" value={presentationItem.count} icon={semanticIcons.comment} />
				</InfoRow>
			))}
			{/* mockup for now */}
			<InfoRow>
				<CarbonIcon icon={getIcon('parser-generated')} />
				<RowTitle muted italic bold={false}>
					parser-generated
				</RowTitle>
				<FlexSplitter />
				<IconLabel title="Commands" value={66} icon={semanticIcons.commands} />
				<IconLabel title="comments" value={8} icon={semanticIcons.comment} />
			</InfoRow>
			<InfoRow>
				<CarbonIcon icon={getIcon('user')} />
				<RowTitle bold={false}>userName</RowTitle>
				<FlexSplitter />
				<IconLabel title="Commands" value={66} icon={semanticIcons.commands} />
				<IconLabel title="comments" value={8} icon={semanticIcons.comment} />
			</InfoRow>
		</>
	);
});

const getIcon = (itemId: string): any => {
	if (itemId === 'favorited') return Bookmark16;
	// replace parser-generated icon
	if (itemId === 'parser-generated') return Strawberry;
	if (itemId === 'user') return User;
	else return Hashtag;
};
