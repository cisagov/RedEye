import type { PopoverProps } from '@blueprintjs/core';
import { Popover, PopoverInteractionKind } from '@blueprintjs/core';
import { observer } from 'mobx-react-lite';

export type CommentPopoverProps = PopoverProps & {};

export const CommentPopover = observer<CommentPopoverProps>(({ ...props }) => (
	<Popover
		enforceFocus
		autoFocus
		usePortal
		lazy
		// hasBackdrop // maybe we still want this?
		minimal
		placement="right-start"
		interactionKind={PopoverInteractionKind.CLICK}
		modifiers={{
			arrow: { enabled: false },
			offset: {
				enabled: true,
				options: {
					offset: [-10, 15],
				},
			},
			flip: {
				enabled: true,
				options: {
					fallbackPlacements: ['left-start'],
				},
			},
			preventOverflow: {
				enabled: true,
				options: {
					padding: commentPopoverPadding,
				},
			},
		}}
		{...props}
	/>
));

export const commentPopoverPadding = {
	top: 160,
	left: 20,
	bottom: 20,
	right: 20,
};
