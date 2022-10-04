import { css } from '@emotion/react';
import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type OptionsSectionProps = ComponentProps<'div'> & {
	title: string;
};

export const OptionsSection = observer<OptionsSectionProps>(({ title, children, ...props }) => (
	<div
		cy-test="optionsSection-root"
		css={css`
			padding-bottom: 1rem;
		`}
		{...props}
	>
		<p
			css={css`
				margin-bottom: 0.5rem;
			`}
		>
			{title}
		</p>
		{children}
	</div>
));
