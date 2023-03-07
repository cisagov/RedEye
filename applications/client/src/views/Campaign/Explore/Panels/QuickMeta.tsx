import { Position } from '@blueprintjs/core';
import type { MenuItem2Props } from '@blueprintjs/popover2';
import { MenuItem2 } from '@blueprintjs/popover2';
import { OverflowMenuVertical16, View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { BeaconModel, HostModel } from '@redeye/client/store';
import type { ServerModel } from '@redeye/client/store';
import type { PopoverButtonProps } from '@redeye/ui-styles';
import { PopoverButton, popoverOffset } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';

type ShowHideMenuItemProps = Partial<MenuItem2Props> & {
	model: HostModel | ServerModel | BeaconModel;
};

export const ShowHideMenuItem = observer<ShowHideMenuItemProps>(({ model, ...props }) => (
	<MenuItem2
		cy-test="show-hide-item"
		text={`${model?.hidden ? 'Show ' : 'Hide '} ${
			model instanceof BeaconModel
				? 'Beacon'
				: model instanceof HostModel && model.cobaltStrikeServer
				? 'Server'
				: 'Host'
		}`}
		icon={<CarbonIcon icon={model?.hidden ? View16 : ViewOff16} />}
		{...props}
	/>
));

export const QuickMetaPopoverButton = observer<PopoverButtonProps>(({ onClick, ...props }) => (
	<PopoverButton
		cy-test="quick-meta-button"
		popoverProps={{
			position: Position.RIGHT,
			modifiers: popoverOffset(0, 30),
			hasBackdrop: true,
		}}
		stopPropagation
		icon={<CarbonIcon icon={OverflowMenuVertical16} />}
		css={buttonStyle}
		{...props}
	/>
));

const buttonStyle = css`
	margin: 0 -8px 0 -4px;
	&:not(:hover) {
		opacity: 0.3;
	}
`;
