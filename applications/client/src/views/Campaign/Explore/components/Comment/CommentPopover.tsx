import type { Popover2Props } from '@blueprintjs/popover2';
import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2';
import { observer } from 'mobx-react-lite';

export type CommentPopoverProps = Popover2Props & {};

export const CommentPopover = observer<CommentPopoverProps>(({ ...props }) => (
	<Popover2
		enforceFocus
		autoFocus
		usePortal
		lazy
		// hasBackdrop // maybe we still want this?
		minimal
		placement="right-start"
		interactionKind={Popover2InteractionKind.CLICK}
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
