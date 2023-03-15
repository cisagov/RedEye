import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';

type OptionsSectionProps = ComponentProps<'div'> & {
	title: string;
};

export const OptionsSection = observer<OptionsSectionProps>(({ title, children, ...props }) => (
	<div cy-test="optionsSection-root" {...props}>
		<p css={{ marginBottom: 6 }}>{title}</p>
		{children}
	</div>
));
