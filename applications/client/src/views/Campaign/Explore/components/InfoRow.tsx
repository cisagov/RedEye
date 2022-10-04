import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import type { ComponentProps, FC } from 'react';

export type InfoRowProps = ComponentProps<'div'> & {};

export const InfoRow: FC<InfoRowProps> = ({ className, ...props }) => (
	<div
		cy-test="info-row"
		className={[Classes.BUTTON, Classes.MINIMAL, className].join(' ')}
		css={css`
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 0.25rem 1rem;
			height: ${defaultInfoRowHeight}px;
		`}
		{...props}
	/>
);

export const defaultInfoRowHeight = 32;
