import { Button, Intent, Menu, MenuItem, Position } from '@blueprintjs/core';
import { Edit16, View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { UseCreateState } from '@redeye/client/components';
import { createState, CarbonIcon } from '@redeye/client/components';
import { store } from '@redeye/client/store';
import { CoreTokens, PopoverButton, popoverOffset, ThemeClasses, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { InfoType } from '@redeye/client/types';
import { ToggleHiddenDialog } from './Meta';

type HostRowProps = ComponentProps<'div'> & {
	typeName: string;
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
			bulkShow: true,
			setBulkShow(bool: boolean) {
				this.bulkShow = bool;
			},
		});

		const isDialogDisabled = useMemo(
			() => window.localStorage.getItem('disableDialog') === 'true',
			[window.localStorage.getItem('disableDialog')]
		);

		return (
			<>
				<div css={modeBarStyle}>
					<Txt>
						{count} {typeName}
						{count === 1 ? '' : 's'} Selected
					</Txt>
					<PopoverButton
						cy-test="quick-meta-button"
						popoverProps={{
							position: Position.RIGHT,
							modifiers: popoverOffset(0, 30),
							hasBackdrop: true,
						}}
						stopPropagation
						icon={
							<Button
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
										text={`Show ${typeName}${count === 1 ? '' : 's'}`}
										icon={<CarbonIcon icon={View16} css={iconStyle(true)} />}
										onClick={(e: React.SyntheticEvent) => {
											e.stopPropagation();
											if (isDialogDisabled) {
												bulkShow.mutate();
											} else {
												state.setBulkShow(true);
												bulkShowState.update('showHide', true);
											}
										}}
									/>
								)}
								<MenuItem
									text={`Hide ${typeName}${count === 1 ? '' : 's'}`}
									icon={<CarbonIcon icon={ViewOff16} css={iconStyle()} />}
									onClick={(e: React.SyntheticEvent) => {
										e.stopPropagation();
										if (isDialogDisabled) {
											bulkHide.mutate();
										} else {
											state.setBulkShow(false);
											bulkHideState.update('showHide', true);
										}
									}}
								/>
							</Menu>
						}
					/>
				</div>
				{!isDialogDisabled && (
					<ToggleHiddenDialog
						typeName={typeName.toLowerCase()}
						isOpen={state.bulkShow ? bulkShowState.showHide : bulkHideState.showHide}
						infoType={typeName === 'Beacon' ? InfoType.BEACON : InfoType.HOST}
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
						// last={last}  // todo - need a way to disable hide last item
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
