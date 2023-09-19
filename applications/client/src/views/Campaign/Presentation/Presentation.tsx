import { css } from '@emotion/react';
import { ScrollBox, ScrollChild } from '@redeye/client/components';
import {
	presentationCommandGroupModelPrimitives,
	presentationItemModelPrimitives,
	RedEyeRoutes,
	useStore,
} from '@redeye/client/store';
import { PresentationItem, PresentationNavBar, PresentationTopicItem } from '@redeye/client/views';
import { Header, CoreTokens } from '@redeye/ui-styles';
import { useQuery } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

type PresentationProps = ComponentProps<'div'> & {};

const Presentation = observer<PresentationProps>(({ ...props }) => {
	const store = useStore();
	/**
	 * On presentation select, update timeline
	 */
	useEffect(() => {
		if (!store.router.params.presentation && store.campaign.timeline.endTime) {
			store.campaign.timeline.setScrubberTimeAny(store.campaign.timeline.endTime);
			store.campaign.timeline.showAllTime();
		}
	}, [store.router.params.presentation]);

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

	/**
	 * Reset presentation on unmount
	 */
	useEffect(() => {
		store.campaign?.interactionState.onHoverOut({});
		return () => {
			store.campaign.presentation.reset();
		};
	}, []);

	return (
		<div
			cy-test="presentation-root"
			{...props}
			css={css`
				display: flex;
				flex-direction: column;
				overflow: hidden;
			`}
		>
			<Routes>
				<Route
					path={`${RedEyeRoutes.CAMPAIGN_PRESENTATION_SELECTED}/*`}
					element={
						<>
							<PresentationNavBar />
							<StyledScrollBox>
								<PresentationItem
									cy-test="presentation-item"
									commandGroupId={
										store.campaign.presentation.selectedItem?.commandGroups?.[store.campaign.presentation.index]?.id
									}
								/>
							</StyledScrollBox>
						</>
					}
				/>
				<Route
					path="*"
					element={
						<>
							<Header
								cy-test="presentation-header-bar"
								medium
								css={css`
									margin-bottom: 0;
									margin: 0.75rem 1rem;
								`}
							>
								Present a Comment Topic
							</Header>
							<StyledScrollBox>
								{data?.presentationItems
									?.filter(
										(presentationItem) =>
											presentationItem.id !== 'procedural' && presentationItem.id.slice(0, 5) !== 'user-'
									)
									.map((presentationItem) => (
										<PresentationTopicItem key={presentationItem.id} presentationItem={presentationItem} />
									))}
							</StyledScrollBox>
						</>
					}
				/>
			</Routes>
		</div>
	);
});

// eslint-disable-next-line import/no-default-export
export default Presentation;

const StyledScrollBox = ({ children, ...props }: ComponentProps<'div'>) => (
	<ScrollBox
		css={{ backgroundColor: CoreTokens.Background2, borderTop: `1px solid ${CoreTokens.BorderNormal}` }}
		{...props}
	>
		<ScrollChild css={{ padding: '1rem 0 4rem 0' }}>{children}</ScrollChild>
	</ScrollBox>
);
