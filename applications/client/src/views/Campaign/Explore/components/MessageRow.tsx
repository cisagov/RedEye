import { css } from '@emotion/react';
import { Txt } from '@redeye/ui-styles';
import type { ComponentProps, FC } from 'react';

export type MessageRowProps = ComponentProps<'div'> & {};

export const MessageRow: FC<MessageRowProps> = ({ ...props }) => (
	<Txt
		cy-test="message-row"
		italic
		disabled
		css={css`
			display: flex;
			align-items: center;
			justify-content: flex-start;
			padding: 0.5rem 1rem;
		`}
		{...props}
	/>
);
