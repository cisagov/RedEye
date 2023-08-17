import { Button, Intent, Menu, Position, MenuItem } from '@blueprintjs/core';
import { Edit16, View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { UseCreateState } from '@redeye/client/components';
import { createState, CarbonIcon } from '@redeye/client/components';
import { store } from '@redeye/client/store';
import { CoreTokens, PopoverButton, popoverOffset, ThemeClasses, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import type { ComponentProps } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { InfoType } from '@redeye/client/types';
import { ToggleHiddenDialog } from './Meta';

type HostRowProps = ComponentProps<'div'> & {
	typeName: 'hosts' | 'beacons';
	count: number;
	bulkShow: UseMutationResult<any, unknown, void, unknown>;
	bulkHide: UseMutationResult<any, unknown, void, unknown>;
	bulkShowState: UseCreateState<
		{
			showHide: boolean;
			refreshHiddenState(): void;
		},
		never
	>;
	bulkHideState: UseCreateState<
		{
			showHide: boolean;
			refreshHiddenState(): void;
		},
		never
	>;
};

export const BulkEdit = observer<HostRowProps>(
	({ typeName, count = 0, bulkShow, bulkHide, bulkShowState, bulkHideState }) => {
		const state = createState({
			cantHideEntities: false,
			isDialogDisabled: window.localStorage.getItem('disableDialog') === 'true',
			bulkShow: true,
			setBulkShow(bool: boolean) {
				this.bulkShow = bool;
			},
			updateBulkSelect(ids: string[]) {
				store.campaign.setBulkSelectCantHideEntityIds(ids);
			},
		});

		const handleBulkShowClick = useCallback(() => {
			if (window.localStorage.getItem('disableDialog') === 'true') {
				bulkShow.mutate();
			} else {
				state.setBulkShow(true);
				bulkShowState.update('showHide', true);
			}
		}, []);

		const handleBulkHideClick = useCallback(async () => {
			state.update('cantHideEntities', false);
			state.update('isDialogDisabled', window.localStorage.getItem('disableDialog') === 'true');
			const data =
				typeName === 'beacons'
					? await store.graphqlStore.queryNonHidableEntities({
							campaignId: store.campaign.id!,
							beaconIds: store.campaign?.beaconGroupSelect.selectedBeacons,
					  })
					: await store.graphqlStore.queryNonHidableEntities({
							campaignId: store.campaign.id!,
							hostIds: [
								...(store.campaign?.hostGroupSelect.selectedHosts || ''),
								...(store.campaign?.hostGroupSelect.selectedServers || ''),
							],
					  });
			const cantHideEntityIds =
				(typeName === 'beacons'
					? data?.nonHidableEntities.beacons?.slice()
					: [
							...(data?.nonHidableEntities.hosts?.slice() || ''),
							...(data?.nonHidableEntities.servers?.slice() || ''),
					  ]) || [];
			const cantHideEntities =
				((typeName === 'beacons'
					? data?.nonHidableEntities.beacons?.length
					: [...(data?.nonHidableEntities.hosts || ''), ...(data?.nonHidableEntities.servers || '')]?.length) || 0) > 0;

			const isDialogDisabled = (window.localStorage.getItem('disableDialog') === 'true' && !cantHideEntities) || false;
			state.update('cantHideEntities', cantHideEntities);
			state.update('isDialogDisabled', isDialogDisabled);
			state.updateBulkSelect(cantHideEntityIds);

			if (isDialogDisabled) {
				bulkHide.mutate();
			} else {
				state.setBulkShow(false);
				bulkHideState.update('showHide', true);
			}
		}, [
			store.campaign?.beaconGroupSelect.selectedBeacons,
			store.campaign?.hostGroupSelect.selectedHosts,
			state.bulkShow,
			state.cantHideEntities,
			state.isDialogDisabled,
		]);

		return (
			<>
				<div css={modeBarStyle}>
					<Txt cy-test="selected-count">
						{count} {typeName === 'beacons' ? 'Beacon' : 'Host'}
						{count <= 1 ? '' : 's'} Selected
					</Txt>
					<PopoverButton
						cy-test="quick-meta-button"
						popoverProps={{
							position: Position.RIGHT,
							modifiers: popoverOffset(0, 30),
							hasBackdrop: true,
						}}
						stopPropagation
						disabled={count === 0}
						icon={
							<Button
								cy-test="bulk-edit"
								disabled={count === 0}
								rightIcon={<CarbonIcon icon={Edit16} />}
								intent={Intent.PRIMARY}
								text="Bulk Edit"
								css={css`
									padding: 0 1rem;
								`}
							/>
						}
						content={
							<Menu>
								{store.settings.showHidden && (
									<MenuItem
										cy-test="show"
										text={`Show ${typeName === 'beacons' ? 'Beacon' : 'Host'}${count === 1 ? '' : 's'}`}
										icon={<CarbonIcon icon={View16} css={iconStyle(true)} />}
										onClick={handleBulkShowClick}
										disabled={
											(typeName === 'beacons'
												? store.campaign?.beaconGroupSelect.hiddenCount
												: store.campaign?.hostGroupSelect.hiddenCount) === 0
										}
									/>
								)}
								<MenuItem
									cy-test="hide"
									text={`Hide ${typeName === 'beacons' ? 'Beacon' : 'Host'}${count === 1 ? '' : 's'}`}
									icon={<CarbonIcon icon={ViewOff16} css={iconStyle()} />}
									onClick={handleBulkHideClick}
									disabled={
										typeName === 'beacons'
											? store.campaign?.beaconGroupSelect.hiddenCount ===
											  store.campaign?.beaconGroupSelect.selectedBeacons.length
											: store.campaign?.hostGroupSelect.hiddenCount ===
											  [
													...(store.campaign?.hostGroupSelect.selectedHosts || ''),
													...(store.campaign?.hostGroupSelect.selectedServers || ''),
											  ].length
									}
								/>
							</Menu>
						}
					/>
				</div>
				{!state.isDialogDisabled && (
					<ToggleHiddenDialog
						typeName={typeName.toLowerCase()}
						isOpen={state.bulkShow ? bulkShowState.showHide : bulkHideState.showHide}
						infoType={typeName === 'beacons' ? InfoType.BEACON : InfoType.HOST}
						isHiddenToggled={state.bulkShow}
						onClose={(e) => {
							e.stopPropagation();
							if (state.bulkShow) {
								bulkShowState.update('showHide', false);
							} else {
								bulkHideState.update('showHide', false);
							}
						}}
						onHide={() => (state.bulkShow ? bulkShow.mutate() : bulkHide.mutate())}
						cantHideEntities={state.cantHideEntities}
						bulk={count > 1}
					/>
				)}
			</>
		);
	}
);

const iconStyle = (show?: boolean) => css`
	margin: 0;
	color: ${show ? CoreTokens.TextBody : CoreTokens.TextDisabled} !important;
`;

const modeBarStyle = css`
	display: flex;
	width: 100%;
	height: 30px !important;
	justify-content: space-between;
	align-items: center;
	padding-left: 1rem;

	color: ${CoreTokens.OnIntent};
	background: ${CoreTokens.Intent.Primary4};
	.${ThemeClasses.DARK} & {
		background: ${CoreTokens.Intent.Primary1};
	}
`;
