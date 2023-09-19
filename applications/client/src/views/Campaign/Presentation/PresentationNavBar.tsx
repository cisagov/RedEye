import { Breadcrumb, Button, ButtonGroup, Intent } from '@blueprintjs/core';
import { SkipBack16, SkipForward16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { routes, useStore } from '@redeye/client/store';
import { CampaignViews } from '@redeye/client/types';
import { SlideSelector, breadcrumbLinkStyle } from '@redeye/client/views';
import { Flex, Header, Spacer, Txt, UtilityStyles, flexChild } from '@redeye/ui-styles';
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
		<Flex align="center">
			<Flex gap={4} align="baseline" overflowHidden fill css={[{ margin: '0 1rem' }, breadcrumbLinkStyle]}>
				<Header small css={[flexChild.fill, UtilityStyles.textEllipsis, { display: 'inline' }]}>
					<Breadcrumb cy-test="back-to-presentations" onClick={routeBackToMenu} text="Topics" intent="primary" />
					<Spacer>/</Spacer>
					<Txt cy-test="presentation-name" ellipsize>
						{store.graphqlStore.presentationItems.get(store.router.params.presentation)?.key}
					</Txt>
				</Header>
				<SlideSelector css={flexChild.fixed} />
			</Flex>

			<ButtonGroup large>
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
		</Flex>
	);
});
