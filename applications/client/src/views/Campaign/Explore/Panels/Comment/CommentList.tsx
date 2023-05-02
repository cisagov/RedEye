import { CarbonIcon, semanticIcons } from '@redeye/client/components';
import {
	OverviewCommentList,
	presentationCommandGroupModelPrimitives,
	presentationItemModelPrimitives,
	useStore,
} from '@redeye/client/store';
import { CoreTokens, FlexSplitter } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { Bookmark16, ChatLaunch16 } from '@carbon/icons-react';
import { Hashtag, User } from '@carbon/icons-react/next';
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
						store.campaign.setOverviewCommentList(
							presentationItem.id === 'procedural'
								? OverviewCommentList.PROCEDURAL
								: presentationItem.id === 'manual'
								? OverviewCommentList.USER_COMMENTS
								: OverviewCommentList.COMMENTS
						);
					}}
				>
					{presentationItem.id !== 'all' && (
						<CarbonIcon
							icon={getIcon(presentationItem.id)}
							css={presentationItem.id === 'procedural' && { color: `${CoreTokens.TextDisabled} !important` }}
						/>
					)}
					<RowTitle
						bold={['all', 'favorited'].includes(presentationItem.id)}
						muted={presentationItem.id === 'procedural'}
						italic={presentationItem.id === 'procedural'}
					>
						{presentationItem.key[0] === '#' ? presentationItem.key.slice(1) : presentationItem.key}
					</RowTitle>
					<FlexSplitter />
					<IconLabel title="Commands" value={presentationItem.commandCount} icon={semanticIcons.commands} />
					<IconLabel title="comments" value={presentationItem.count} icon={semanticIcons.comment} />
				</InfoRow>
			))}
			{/* mockup for now */}
			<InfoRow>
				<CarbonIcon icon={getIcon('manual')} />
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
	if (itemId === 'procedural') return ChatLaunch16;
	if (itemId === 'manual') return User;
	else return Hashtag;
};