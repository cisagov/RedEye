import { Button, ButtonProps } from '@blueprintjs/core';
import { Popover2, Popover2Props, Popover2TargetProps } from '@blueprintjs/popover2';

export type PopoverButtonProps = ButtonProps & {
	popoverProps?: Omit<Partial<Popover2Props>, 'children' | 'renderTarget' | 'content'>;
	/** the Popover.content */
	content: Popover2Props['content'];
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
		<Popover2
			renderTarget={({
				isOpen,
				ref,
				className: targetClassName,
				onClick,
				...targetProps
			}: Popover2TargetProps & ButtonProps) => (
				<Button
					elementRef={ref}
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
		/>
	);
};

export const popoverOffset = (
	/** displaces the Popover along the reference element */
	skidding: number,
	/** displaces the Popover away from, or toward, the reference element in the direction of its placement */
	distance: number
): Popover2Props['modifiers'] => ({
	offset: {
		enabled: true,
		options: {
			offset: [skidding, distance],
		},
	},
});
