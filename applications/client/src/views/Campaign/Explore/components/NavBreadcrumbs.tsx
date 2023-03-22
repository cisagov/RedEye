import type { BreadcrumbProps, BreadcrumbsProps } from '@blueprintjs/core';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { CommandModel } from '@redeye/client/store';
import { routes, useStore } from '@redeye/client/store';
import type { BreadcrumbsStyledProps } from '@redeye/client/views';
import { BreadcrumbsStyled } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import { CampaignViews, Tabs } from '../../../../types';
import type { UUID } from '../../../../types';

type NavBreadcrumbsProps = Omit<BreadcrumbsProps, 'items'> &
	BreadcrumbsStyledProps & {
		/** if specified, show a nav from the command, otherwise display nav relative to the current route */
		command?: CommandModel;
		// from: ServerModel | HostModel | BeaconModelType | CommandModelType // instead of command
		/** fire when the component navigates */
		onNavigate?: (event: MouseEvent<HTMLElement>) => void;
		/** hide the root "All" nav */
		hideRoot?: boolean;
		/** show the "current" part of the route */
		showCurrent?: boolean;
	};
export const NavBreadcrumbs = observer<NavBreadcrumbsProps>(
	({ command, onNavigate = () => {}, hideRoot = false, showCurrent = false, ...props }) => {
		// TODO: maybe state.breadCrumbs and state.commandBreadCrumbs could be combined?

		const store = useStore();

		const state = createState({
			command,
			get breadCrumbs() {
				const crumbs: Array<BreadcrumbProps> = [];

				const isHome = !(
					store.campaign?.interactionState.selectedServer ||
					store.campaign?.interactionState.selectedCommandType ||
					store.campaign?.interactionState.selectedOperator ||
					store.campaign?.interactionState.selectedHost ||
					store.campaign?.interactionState.selectedBeacon
				);

				if (!hideRoot)
					crumbs.push({
						text: 'All',
						current: isHome,
						onClick: !isHome
							? (e) => {
									onNavigate(e);
									store.router.updateRoute({
										path: routes[CampaignViews.EXPLORE],
										params: {
											id: store.campaign.id,
											view: CampaignViews.EXPLORE,
											currentItem: 'all',
											currentItemId: undefined,
											activeItem: undefined,
											activeItemId: undefined,
											tab: Tabs.HOSTS,
										},
									});
							  }
							: undefined,
					});

				if (store.campaign?.interactionState.selectedCommandType)
					crumbs.push({
						text: 'Command',
						current: true,
					});
				else if (store.campaign?.interactionState.selectedOperator)
					crumbs.push({
						text: 'Operator',
						current: true,
					});
				else if (store.campaign?.interactionState.selectedServer)
					crumbs.push({
						text: !store.campaign?.interactionState.selectedHost
							? 'Server'
							: store.campaign?.interactionState.selectedServer?.current?.computedName,
						current: !store.campaign?.interactionState.selectedHost,
						onClick: store.campaign?.interactionState.selectedHost
							? (e) => {
									onNavigate(e);
									store.campaign?.interactionState.selectedServer?.current.searchSelect();
							  }
							: undefined,
					});

				if (store.campaign?.interactionState.selectedHost)
					crumbs.push({
						text: !store.campaign?.interactionState.selectedBeacon
							? 'Host'
							: store.campaign?.interactionState.selectedHost?.current?.computedName,
						current: !store.campaign?.interactionState.selectedBeacon,
						onClick: store.campaign?.interactionState.selectedBeacon
							? (e) => {
									onNavigate(e);
									store.campaign?.interactionState.selectedHost?.current?.navCommandSelect();
							  }
							: undefined,
					});

				if (store.campaign?.interactionState.selectedBeacon) crumbs.push({ text: 'Beacon', current: true });
				return crumbs;
			},
			get commandBreadCrumbs() {
				const crumbs: Array<BreadcrumbProps> = [];

				if (!hideRoot)
					crumbs.push({
						text: 'All',
						onClick: async (e) => {
							e.stopPropagation();
							await onNavigate(e);
							await this.command?.beacon?.current?.select();
						},
					});

				crumbs.push(
					{
						text: this.command?.beacon?.current?.server?.computedName ?? 'Server',
						onClick: async (e) => {
							await onNavigate(e);
							this.command?.beacon?.current?.server?.select();
						},
					},
					{
						text: this.command?.beacon?.current?.host?.current?.computedName,
						onClick: async (e) => {
							e.stopPropagation();
							if (
								store.router.params.tab !== Tabs.COMMANDS ||
								store.router.params.currentItem === 'operator' ||
								store.router.params.currentItem === 'command-type'
							) {
								await onNavigate(e);
								this.command?.beacon?.current?.host?.current?.navCommandSelect();
							}
						},
					},
					{
						text: `${this.command?.beacon?.current?.computedName} ${
							this.command?.beacon?.current?.meta?.[0]?.maybeCurrent?.username || ''
						}`,
						onClick: async (e) => {
							e.stopPropagation();
							await onNavigate(e);
							this.command?.beacon?.current?.select('command', this.command?.id as UUID);
						},
					},
					{
						text: this.command?.inputText,
						current: true,
					}
				);

				return crumbs;
			},
		});

		useEffect(() => {
			state.update('command', command);
		}, [command]);

		const crumbs = (state.command != null ? state.commandBreadCrumbs : state.breadCrumbs).filter(
			(crumb) => !crumb.current || showCurrent
		);

		return (
			<BreadcrumbsStyled
				// css={css``}
				items={crumbs}
				{...props}
			/>
		);
	}
);
