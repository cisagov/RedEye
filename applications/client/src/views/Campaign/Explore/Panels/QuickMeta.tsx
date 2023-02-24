import { Button, Menu, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { OverflowMenuVertical16, View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { BeaconModel, HostModel } from '@redeye/client/store';
import type { ServerModel } from '@redeye/client/store';
import { CoreTokens } from '@redeye/ui-styles';
import type { UseMutationResult } from '@tanstack/react-query';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type HostRowProps = ComponentProps<'div'> & {
	modal: HostModel | ServerModel | BeaconModel;
	mutateToggleHidden?: UseMutationResult<any, unknown, void, unknown>;
	disabled?: boolean;
	click?: () => void;
};

export const QuickMeta = observer<HostRowProps>(({ modal, mutateToggleHidden, click, disabled = false }) => {
	if (!modal) return null;

	return (
		<Popover2
			position={Position.RIGHT}
			openOnTargetFocus={false}
			interactionKind="hover"
			hoverOpenDelay={300}
			modifiers={{
				offset: {
					enabled: true,
					options: {
						offset: [0, 30],
					},
				},
			}}
			content={
				<Menu cy-test="show-hide-item">
					<MenuItem
						disabled={disabled}
						text={`${modal?.hidden ? 'Show ' : 'Hide '} ${
							modal instanceof BeaconModel
								? 'Beacon'
								: modal instanceof HostModel && modal.cobaltStrikeServer
								? 'Server'
								: 'Host'
						}`}
						icon={<CarbonIcon icon={modal?.hidden ? View16 : ViewOff16} css={iconStyle(!!modal?.hidden)} />}
						onClick={(e) => {
							e.stopPropagation();
							// mutateToggleHidden?.mutate();
							click?.();
						}}
					/>
				</Menu>
			}
		>
			<Button
				cy-test="show-hide-hover"
				icon={<CarbonIcon icon={OverflowMenuVertical16} />}
				minimal
				small
				css={buttonStyle}
			/>
		</Popover2>
	);
});

const iconStyle = (show?: boolean) => css`
	margin: 0;
	color: ${show ? CoreTokens.TextBody : CoreTokens.TextDisabled} !important;
`;

const buttonStyle = css`
	margin: 0 -8px 0 -4px;
	&:not(:hover) {
		opacity: 0.3;
	}
`;
