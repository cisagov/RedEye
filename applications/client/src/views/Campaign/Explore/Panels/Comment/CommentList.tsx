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
							presentationItem.id === 'all' && presentationItem.key === 'All Comments'
								? OverviewCommentList.ALL_COMMENTS
								: presentationItem.id === 'favorited' && presentationItem.key === 'Favorited Comments'
								? OverviewCommentList.FAVORITED_COMMENTS
								: presentationItem.id === 'procedural' && presentationItem.key === 'parser-generated'
								? OverviewCommentList.PROCEDURAL
								: presentationItem.id.slice(0, 5) === 'user-' && presentationItem.key.slice(0, 5) === 'user-'
								? OverviewCommentList.USER_COMMENTS
								: OverviewCommentList.TAG_COMMENTS
						);
						store.campaign.setOverviewCommentType(
							(presentationItem.id === 'all' && presentationItem.key === 'All Comments') ||
								(presentationItem.id === 'favorited' && presentationItem.key === 'Favorited Comments') ||
								(presentationItem.id === 'procedural' && presentationItem.key === 'parser-generated')
								? presentationItem.key
								: presentationItem.id.slice(0, 5) === 'user-' && presentationItem.key.slice(0, 5) === 'user-'
								? presentationItem.id.slice(5)
								: `#${presentationItem.id}`
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
						{presentationItem.key[0] === '#'
							? presentationItem.key.slice(1)
							: presentationItem.key.slice(0, 5) === 'user-'
							? presentationItem.key.slice(5)
							: presentationItem.key}
					</RowTitle>
					<FlexSplitter />
					<IconLabel title="Commands" value={presentationItem.commandCount} icon={semanticIcons.commands} />
					<IconLabel title="comments" value={presentationItem.count} icon={semanticIcons.comment} />
				</InfoRow>
			))}
		</>
	);
});

const getIcon = (itemId: string): any => {
	if (itemId === 'favorited') return Bookmark16;
	if (itemId === 'procedural') return ChatLaunch16;
	if (itemId.slice(0, 5) === 'user-') return User;
	else return Hashtag;
};
