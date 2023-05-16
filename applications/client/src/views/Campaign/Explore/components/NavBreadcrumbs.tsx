import type { BreadcrumbProps, BreadcrumbsProps } from '@blueprintjs/core';
import { createState } from '@redeye/client/components/mobx-create-state';
import type { BeaconModel, CommandModel } from '@redeye/client/store';
import { CommentListBreadCrumb, routes, useStore } from '@redeye/client/store';
import type { BreadcrumbsStyledProps } from '@redeye/client/views';
import { BreadcrumbsStyled } from '@redeye/client/views';
import { observer } from 'mobx-react-lite';
import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import { CampaignViews, Tabs } from '../../../../types';
import type { UUID } from '../../../../types';

type NavBreadcrumbsProps = Omit<BreadcrumbsProps, 'items'> &
	BreadcrumbsStyledProps & {
		/** if specified, show a nav to the beacon, otherwise display nav relative to the current route */
		beacon?: BeaconModel;
		/** if specified, show a nav from the command, otherwise display nav relative to the current route */
		command?: CommandModel;
		// from: ServerModel | HostModel | BeaconModelType | CommandModelType // instead of command
		/** fire when the component navigates */
		onNavigate?: (event: MouseEvent<HTMLElement>) => void;
		/** hide the root "All" nav */
		hideRoot?: boolean;
		/** hide the root "All" nav and the Server */
		hideServer?: boolean;
		/** show the "current" part of the route */
		showCurrent?: boolean;
	};
export const NavBreadcrumbs = observer<NavBreadcrumbsProps>(
	({ command, beacon, onNavigate = () => {}, hideRoot = false, hideServer = false, showCurrent = false, ...props }) => {
		// TODO: maybe state.breadCrumbs and state.commandBreadCrumbs could be combined?

		const store = useStore();

		const state = createState({
			command,
			beacon,
			get relativeBreadCrumbs() {
				const crumbs: Array<BreadcrumbProps> = [];

				const isHome = !(
					store.campaign?.interactionState.selectedServer ||
					store.campaign?.interactionState.selectedCommandType ||
					store.campaign?.interactionState.selectedOperator ||
					store.campaign?.interactionState.selectedHost ||
					store.campaign?.interactionState.selectedBeacon
				);

				if (store.router.params.currentItem === 'comments_list' && store.router.params.currentItemId) {
					crumbs.push({
						text: 'All',
						onClick: () => {
							store.router.updateRoute({
								path: routes[CampaignViews.EXPLORE],
								params: {
									id: store.campaign.id,
									view: CampaignViews.EXPLORE,
									tab: Tabs.COMMENTS_LIST,
									currentItem: 'all',
									currentItemId: undefined,
								},
							});
						},
					});
					crumbs.push({
						text:
							store.router.params.currentItemId.slice(0, 5) === 'user-'
								? CommentListBreadCrumb.user
								: store.router.params.currentItemId.slice(0, 4) === 'tag-'
								? CommentListBreadCrumb.tag
								: CommentListBreadCrumb[store.router.params.currentItemId],
						current: true,
					});
					return crumbs;
				}

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

				// if (store.router.params.currentItem === 'comments_list' && store.router.params.currentItemId) {
				// 	// crumbs.push({
				// 	// 	text: 'All',
				// 	// 	onClick: () => {
				// 	// 		store.campaign.setOverviewCommentList(OverviewCommentList.ALL);
				// 	// 	},
				// 	// });
				// 	crumbs.push({
				// 		text:
				// 			store.router.params.currentItemId.slice(0, 5) === 'user-'
				// 				? CommentListBreadCrumb.user
				// 				: store.router.params.currentItemId.slice(0, 4) === 'tag-'
				// 				? CommentListBreadCrumb.tag
				// 				: CommentListBreadCrumb[store.router.params.currentItemId],
				// 		current: true,
				// 	});
				// 	return crumbs;
				// }

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
							: store.campaign?.interactionState.selectedServer?.current?.displayName,
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
							: store.campaign?.interactionState.selectedHost?.current?.displayName,
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
			get breadCrumbs() {
				const currentBeacon = this.command?.beacon?.current ?? this.beacon;
				if (!currentBeacon) return this.relativeBreadCrumbs;

				// There must be a better way to know this
				const beaconIsServer = currentBeacon.beaconName === currentBeacon.server?.name;

				const crumbs: Array<BreadcrumbProps> = [];

				if (!hideRoot && !hideServer)
					crumbs.push({
						text: 'All',
						onClick: async (e) => {
							e.stopPropagation();
							await onNavigate(e);
							await currentBeacon?.select();
						},
					});

				if (!hideServer || beaconIsServer)
					crumbs.push({
						text: currentBeacon?.server?.displayName ?? 'Server',
						onClick: async (e) => {
							await onNavigate(e);
							currentBeacon?.server?.select();
						},
					});

				if (beaconIsServer) return crumbs;

				crumbs.push(
					{
						text: currentBeacon?.host?.current?.displayName,
						onClick: async (e) => {
							e.stopPropagation();
							if (
								store.router.params.tab !== Tabs.COMMANDS ||
								store.router.params.currentItem === 'operator' ||
								store.router.params.currentItem === 'command-type'
							) {
								await onNavigate(e);
								currentBeacon?.host?.current?.navCommandSelect();
							}
						},
					},
					{
						text: `${currentBeacon?.displayName} ${currentBeacon?.meta?.[0]?.maybeCurrent?.username || ''}`,
						onClick: async (e) => {
							e.stopPropagation();
							await onNavigate(e);
							currentBeacon?.select('command', this.command?.id as UUID);
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
			state.update('beacon', beacon);
		}, [command, beacon]);

		const crumbs = state.breadCrumbs.filter((crumb) => !crumb.current || showCurrent);

		return <BreadcrumbsStyled items={crumbs} {...props} />;
	}
);
