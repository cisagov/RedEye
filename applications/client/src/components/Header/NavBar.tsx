import type { ButtonProps } from '@blueprintjs/core';
import { Button } from '@blueprintjs/core';
import { PresentationFile24, Search24, Terminal24 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { AppOptions, CarbonIcon, Logo } from '@redeye/client/components';
import { routes, useStore } from '@redeye/client/store';
import { Tabs } from '@redeye/client/types/explore';
import { CoreTokens, FlexSplitter } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps, FC } from 'react';
import { CampaignViews, Views } from '../../types';
import { SearchPanelOverlay } from '../../views/Campaign/Search/SearchPanelOverlay';

type NavBarProps = ComponentProps<'header'> & {};

export const NavBar = observer<NavBarProps>(({ ...props }) => {
	const store = useStore(); // TODO: buttons navigate to new routes

	return (
		<header {...props} css={wrapperStyle}>
			<Logo
				cy-test="return-campaign-menu"
				css={logoStyle}
				title="Return to Campaign Menu"
				onClick={() =>
					store.router.updateRoute({
						path: routes[Views.CAMPAIGNS_LIST],
						params: { id: store.router.params.id || 'all' },
						clear: true,
					})
				}
			/>
			<NavButton
				cy-test="explorer-mode"
				icon={<CarbonIcon icon={Terminal24} />}
				title="Explorer Mode"
				active={store.router.params.view === CampaignViews.EXPLORE}
				onClick={() =>
					store.router.updateRoute({
						path: routes[CampaignViews.EXPLORE],
						params: {
							id: store.campaign.id,
							view: CampaignViews.EXPLORE,
							tab: Tabs.HOSTS,
							currentItem: 'all',
							currentItemId: undefined,
							activeItem: undefined,
							activeItemId: undefined,
						},
						queryParams: store.router.queryParams.search
							? {
									search: store.router.queryParams.search,
									'search-modal': store.router.queryParams['search-modal'],
							  }
							: {},
						clear: store.router.params.tab !== 'beacons' && store.router.params.currentItem !== 'all',
					})
				}
			/>
			<NavButton
				cy-test="presentation-mode"
				icon={<CarbonIcon icon={PresentationFile24} />}
				title="Presentation Mode"
				active={store.router.params.view === CampaignViews.PRESENTATION}
				onClick={() =>
					store.router.updateRoute({
						path: routes[CampaignViews.PRESENTATION],
						params: {
							id: store.campaign.id,
							view: CampaignViews.PRESENTATION,
						},
						clear: true,
					})
				}
			/>
			<NavButton
				cy-test="search-mode"
				icon={<CarbonIcon icon={Search24} />}
				title="Search"
				active={store.campaign.search.isSearchModalOpen}
				onClick={() => {
					store.campaign.search.openSearch();
				}}
			/>
			<FlexSplitter />
			<AppOptions navBar />
			<SearchPanelOverlay
				isOpen={store.campaign.search.isSearchModalOpen}
				onClose={() => {
					store.campaign.search.closeSearch();
				}}
			/>
		</header>
	);
});

const wrapperStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 4rem;
	padding-bottom: 1rem;
	background-color: ${CoreTokens.Background1};
`;
const logoSize = 48;
const logoStyle = css`
	height: ${logoSize}px;
	width: ${logoSize}px;
	margin: 1rem 2px;
	cursor: pointer;
	transition: 100ms ease-in transform;
	&:hover {
		transform: scale(1.05);
	}
	&:active {
		transform: scale(1);
	}
`;

type NavButtonProps = ButtonProps & { title?: string };

export const NavButton: FC<NavButtonProps> = ({ active, ...props }) => (
	<Button {...props} css={[navButtonStyles, active ? navButtonActiveStyles : undefined]} minimal fill />
);

const navButtonStyles = css`
	border: solid transparent;
	border-width: 0 3px;
	margin: 1px 0;
	height: 3rem;
`;

const navButtonActiveStyles = css`
	border-left-color: ${CoreTokens.Intent.Primary3};
`;
