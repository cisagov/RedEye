import { Button, Intent, Menu, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Edit16, View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { store } from '@redeye/client/store';
import { CoreTokens, ThemeClasses, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import type { UseMutationResult } from '@tanstack/react-query';

type HostRowProps = ComponentProps<'div'> & {
	modal: string;
	count: number;
	bulkShow: UseMutationResult<any, unknown, void, unknown>;
	bulkHide: UseMutationResult<any, unknown, void, unknown>;
};

export const BulkEdit = observer<HostRowProps>(({ modal, count = 0, bulkShow, bulkHide }) => (
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
							onClick={(e) => {
								e.stopPropagation();
								bulkShow.mutate();
							}}
						/>
					)}
					<MenuItem
						text={`Hide ${modal}${count === 1 ? '' : 's'}`}
						icon={<CarbonIcon icon={ViewOff16} css={iconStyle()} />}
						onClick={(e) => {
							e.stopPropagation();
							bulkHide.mutate();
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
));

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
