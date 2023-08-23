import { Divider } from '@blueprintjs/core';
import type { DividerProps } from '@blueprintjs/core';
import { css } from '@emotion/react';
import type { FC } from 'react';
import { CoreTokens } from '../styles/tokens';

export type BorderProps = DividerProps & {
	emphasis?: boolean;
	muted?: boolean;
	invert?: boolean;
	vertical?: boolean;
};

export const Border: FC<BorderProps> = ({
	emphasis = false,
	muted = false,
	invert = false,
	vertical = false,
	...props
}) => (
	<Divider
		css={[
			vertical ? borderVerticalStyle : borderStyle,
			{
				borderColor: emphasis
					? CoreTokens.BorderNormal
					: muted
					? CoreTokens.BorderMuted
					: invert
					? CoreTokens.BorderInvert
					: CoreTokens.BorderNormal,
			},
		]}
		{...props}
	/>
);
const borderStyle = css`
	margin: 0;
	border-bottom: 1px solid;
`;

const borderVerticalStyle = css`
	margin: 0 0.5rem;
	height: 1rem;
	display: inline-block;
`;
