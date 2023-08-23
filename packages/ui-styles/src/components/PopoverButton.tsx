import type { ButtonProps, PopoverProps } from '@blueprintjs/core';
import { Button, Popover } from '@blueprintjs/core';

export type PopoverButtonProps = Omit<ButtonProps, 'content'> & {
	popoverProps?: Omit<Partial<PopoverProps>, 'children' | 'renderTarget' | 'content'>;
	/** the Popover.content */
	content: PopoverProps['content'];
	/** eat the click event so this button can be inside another clickable element */
	stopPropagation?: boolean;
};

export const PopoverButton = ({
	className: buttonClassName,
	popoverProps,
	content,
	onClick: onClickButton,
	stopPropagation = false,
	...buttonProps
}: PopoverButtonProps) => {
	return (
		<Popover
			renderTarget={({ isOpen, ref, className: targetClassName, onClick, ...targetProps }) => (
				<Button
					ref={ref}
					active={isOpen}
					small
					minimal
					className={[targetClassName, buttonClassName].join(' ')}
					onClick={(e) => {
						if (stopPropagation) e.stopPropagation();
						onClickButton?.(e);
						onClick?.(e);
					}}
					{...buttonProps}
					{...targetProps}
				/>
			)}
			content={content}
			{...popoverProps}
			onClose={(e) => {
				if (stopPropagation) e.stopPropagation();
				popoverProps?.onClose?.(e);
			}}
		/>
	);
};

export const popoverOffset = (
	/** displaces the Popover along the reference element */
	skidding: number,
	/** displaces the Popover away from, or toward, the reference element in the direction of its placement */
	distance: number
): PopoverProps['modifiers'] => ({
	offset: {
		enabled: true,
		options: {
			offset: [skidding, distance],
		},
	},
});
