import { css } from '@emotion/react';
import { ScrollBox, ScrollChild } from '@redeye/client/components';
import {
	presentationCommandGroupModelPrimitives,
	presentationItemModelPrimitives,
	RedEyeRoutes,
	useStore,
} from '@redeye/client/store';
import { PresentationItem, PresentationNavBar, PresentationTopicItem, SlideSelector } from '@redeye/client/views';
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
				/* width: 100%; */
				display: flex;
				flex-direction: column;
				overflow: hidden;
				/* background-color: var(--dark-gray2); */
			`}
		>
			<div
				css={css`
					flex: 0 0 auto;
					border-bottom: 1px solid ${CoreTokens.BorderNormal};
				`}
			>
				{store.campaign.presentation.isPresenting ? (
					<PresentationNavBar />
				) : (
					<Header
						medium
						css={css`
							margin-bottom: 0;
							margin: 0.75rem 1rem;
						`}
					>
						Select a comment topic to present
					</Header>
				)}
			</div>
			<ScrollBox css={{ backgroundColor: CoreTokens.Background2 }}>
				<ScrollChild css={{ padding: '1rem 0 4rem 0' }}>
					<Routes>
						<Route
							path={`${RedEyeRoutes.CAMPAIGN_PRESENTATION_SELECTED}/*`}
							element={
								<>
									<SlideSelector />
									<PresentationItem
										commandGroupId={
											store.campaign.presentation.selectedItem?.commandGroups?.[store.campaign.presentation.index]?.id
										}
									/>
								</>
							}
						/>
						<Route
							path="*"
							element={
								<>
									{data?.presentationItems?.map((presentationItem) => (
										<PresentationTopicItem key={presentationItem.id} presentationItem={presentationItem} />
									))}
								</>
							}
						/>
					</Routes>
				</ScrollChild>
			</ScrollBox>
		</div>
	);
});

// eslint-disable-next-line import/no-default-export
export default Presentation;
