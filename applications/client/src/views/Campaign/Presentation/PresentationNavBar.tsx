import { Button, ButtonGroup, Divider, Intent } from '@blueprintjs/core';
import { ArrowLeft16, SkipBack16, SkipForward16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { routes, useStore } from '@redeye/client/store';
import { CampaignViews } from '@redeye/client/types';
import { Header } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type HeaderProps = ComponentProps<'div'> & {};

export const PresentationNavBar = observer<HeaderProps>(({}) => {
	const store = useStore();

	const routeBackToMenu = () =>
		store?.router.updateRoute({
			path: routes[CampaignViews.PRESENTATION],
			params: { presentation: undefined, slide: undefined, currentItem: undefined, currentItemId: undefined },
		});

	const nextSlide = () => store.campaign.presentation.forward();

	const isLastSlide =
		store.campaign.presentation.index >= (store.campaign.presentation.selectedItem?.commandGroups?.length || 1) - 1;

	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				/* align-items: center; */
			`}
		>
			<div
				css={css`
					display: flex;
					align-items: center;
					margin: 0 1rem;
				`}
			>
				<Button
					cy-test="back-to-presentations"
					icon={<CarbonIcon icon={ArrowLeft16} />}
					minimal
					onClick={routeBackToMenu}
				/>
				<Divider
					css={css`
						height: 1rem;
						margin: 0 1rem 0 0.5rem;
					`}
				/>
				<Header cy-test="presentation-name" small>
					{store.graphqlStore.presentationItems.get(store.router.params.presentation)?.key}
				</Header>
			</div>
			<ButtonGroup
				large
				css={css`
					/* height: 100%; */
				`}
			>
				<Button
					cy-test="previous-slide"
					icon={<CarbonIcon icon={SkipBack16} />}
					disabled={store.campaign.presentation.index === 0}
					onClick={() => store.campaign.presentation.back()}
				/>
				<Button
					// Maybe isLastSlide should make this a restart button?
					cy-test="next-slide"
					rightIcon={isLastSlide ? undefined : <CarbonIcon icon={SkipForward16} />}
					intent={Intent.PRIMARY}
					onClick={isLastSlide ? routeBackToMenu : nextSlide}
					text={isLastSlide ? 'Finish' : 'Next'}
					css={[
						css`
							width: 100px;
						`,
						!isLastSlide &&
							css`
								justify-content: space-between;
							`,
					]}
				/>
			</ButtonGroup>
		</div>
	);
});
