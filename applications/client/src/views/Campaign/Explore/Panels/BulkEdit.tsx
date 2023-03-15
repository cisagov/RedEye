import { Button, Intent, Menu, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Edit16, View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { UseCreateState } from '@redeye/client/components';
import { createState, CarbonIcon } from '@redeye/client/components';
import { store } from '@redeye/client/store';
import { CoreTokens, ThemeClasses, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import type { ComponentProps } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';
import { InfoType } from '@redeye/client/types';
import { ToggleHiddenDialog } from './Meta';

type HostRowProps = ComponentProps<'div'> & {
	modal: string;
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
	({ modal, count = 0, bulkShow, bulkHide, bulkShowState, bulkHideState }) => {
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
						{count} {modal}
						{count === 1 ? '' : 's'} Selected
					</Txt>
					<Popover2
						position={Position.RIGHT}
						openOnTargetFocus={false}
						interactionKind="hover"
						hoverOpenDelay={300}
						disabled={count === 0}
						content={
							<Menu>
								{store.settings.showHidden && (
									<MenuItem
										text={`Show ${modal}${count === 1 ? '' : 's'}`}
										icon={<CarbonIcon icon={View16} css={iconStyle(true)} />}
										onClick={(e: React.SyntheticEvent) => {
											e.stopPropagation();
											// bulkShow.mutate();
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
									text={`Hide ${modal}${count === 1 ? '' : 's'}`}
									icon={<CarbonIcon icon={ViewOff16} css={iconStyle()} />}
									onClick={(e: React.SyntheticEvent) => {
										e.stopPropagation();
										// bulkHide.mutate();
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
					>
						<Button
							disabled={count === 0}
							rightIcon={<CarbonIcon icon={Edit16} />}
							intent={Intent.PRIMARY}
							text="Bulk Edit"
							css={css`
								padding: 0 1rem;
							`}
						/>
					</Popover2>
				</div>
				{!isDialogDisabled && (
					<ToggleHiddenDialog
						typeName={modal.toLowerCase()}
						isOpen={state.bulkShow ? bulkShowState.showHide : bulkHideState.showHide}
						infoType={modal === 'Beacon' ? InfoType.BEACON : InfoType.HOST}
						isHiddenToggled={state.bulkShow}
						onClose={(e) => {
							e.stopPropagation();
							bulkShowState.update('showHide', false);
						}}
						onHide={() => (state.bulkShow ? bulkShow.mutate() : bulkHide.mutate())}
						// last={last}  // todo - need a way to disable hide last item
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
	justify-content: space-between;
	align-items: center;
	padding-left: 1rem;

	color: ${CoreTokens.OnIntent};
	background: ${CoreTokens.Intent.Primary4};
	.${ThemeClasses.DARK} & {
		background: ${CoreTokens.Intent.Primary1};
	}
`;
