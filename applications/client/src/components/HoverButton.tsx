import type { ButtonProps } from '@blueprintjs/core';
import { Button } from '@blueprintjs/core';
import type { FC } from 'react';
import { useState } from 'react';

type Props = ButtonProps & {
	hoverProps?: ButtonProps;
};

/** <Button/> that can change its props when hovered */
export const HoverButton: FC<Props> = ({ hoverProps = {}, ...props }) => {
	const [isHovering, setIsHovering] = useState(false);
	const mergedProps = {
		...props, // initial props
		...(isHovering ? hoverProps : {}), // overridden with hover props
	};
	return <Button onMouseOver={() => setIsHovering(true)} onMouseOut={() => setIsHovering(false)} {...mergedProps} />;
};
