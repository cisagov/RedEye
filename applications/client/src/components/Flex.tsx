import { css } from '@emotion/react';
import type { ComponentProps, FC } from 'react';

type FlexProps = ComponentProps<'div'> & {
	column?: boolean;
	// more?
};

export const Flex: FC<FlexProps> = ({ column = false, ...props }) => (
	<div
		css={[
			css`
				display: flex;
			`,
			column &&
				css`
					flex-direction: column;
				`,
		]}
		{...props}
	/>
);
// COPY AND PASTE THIS BOILERPLATE ELEMENT //
