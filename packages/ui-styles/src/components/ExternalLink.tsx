import type { ComponentProps } from 'react';
import type { TxtProps } from './Text';
import { Txt } from './Text';

export const externalLinkAttributes = {
	target: '_blank',
	rel: 'noopener noreferrer',
};

export const ExternalLink = (props: TxtProps & ComponentProps<'a'>) => (
	<Txt tagName="a" {...externalLinkAttributes} {...props} />
);
