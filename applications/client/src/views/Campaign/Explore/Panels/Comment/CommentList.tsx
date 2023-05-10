import { CarbonIcon, semanticIcons } from '@redeye/client/components';
import { PresentationItemModel, routes } from '@redeye/client/store';
import {
	OverviewCommentList,
	presentationCommandGroupModelPrimitives,
	presentationItemModelPrimitives,
	useStore,
} from '@redeye/client/store';
import { CoreTokens, FlexSplitter } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import { Bookmark16, Hashtag16, Playlist16, User16 } from '@carbon/icons-react';
import { useCallback, useMemo } from 'react';
import { InfoRow, RowTitle, IconLabel } from '../../components';
import { CampaignViews, Tabs } from '@redeye/client/types';

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

	// For presentationItem.id by User or Tag, make sure use a prefix in case it's same to other general types.
	const handleClickType = useCallback((presentationItem) => {
		console.log('tab1: ', store.router.params.tab);
		setCommandGroupIds(presentationItem.commandGroupIds);
		store.campaign.setOverviewCommentList(
			presentationItem.id === 'all'
				? OverviewCommentList.ALL_COMMENTS
				: presentationItem.id === 'favorited'
				? OverviewCommentList.FAVORITED_COMMENTS
				: presentationItem.id === 'procedural'
				? OverviewCommentList.PROCEDURAL
				: presentationItem.id.slice(0, 5) === 'user-'
				? OverviewCommentList.USER_COMMENTS
				: OverviewCommentList.TAG_COMMENTS
		);
		store.campaign.setOverviewCommentType(
			presentationItem.key.slice(0, 5) === 'user-' ? presentationItem.key.slice(5) : presentationItem.key
		);
		store.router.updateRoute({
			path: routes[CampaignViews.EXPLORE],
			params: {
				id: store.campaign.id,
				view: CampaignViews.EXPLORE,
				tab: Tabs.COMMENTS,
				currentItem: 'comments_list',
				currentItemId: 'allComments',
				activeItem: undefined,
				activeItemId: undefined,
			},
			// clear: store.router.params.tab !== 'beacons' && store.router.params.currentItem !== 'all',
		});
		console.log('tab2: ', store.router.params.currentItem, store.router.params.tab, store.router.params);
	}, []);

	const rowTitle = useMemo(
		() => (presentationItem: PresentationItemModel) =>
			presentationItem.key[0] === '#'
				? presentationItem.key.slice(1)
				: presentationItem.key.slice(0, 5) === 'user-'
				? presentationItem.key.slice(5)
				: presentationItem.key,
		[]
	);

	return (
		<>
			{data?.presentationItems?.map((presentationItem, i) => (
				<InfoRow
					// eslint-disable-next-line react/no-array-index-key
					key={`${presentationItem.id}-${i}`}
					onClick={() => handleClickType(presentationItem)}
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
						{rowTitle(presentationItem)}
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
	if (itemId === 'procedural') return Playlist16;
	if (itemId.slice(0, 5) === 'user-') return User16;
	else return Hashtag16;
};
