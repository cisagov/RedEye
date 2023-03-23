import { ComponentProps } from 'react';
import { Txt, TxtProps } from './Text';

export const externalLinkAttributes = {
	target: '_blank',
	rel: 'noopener noreferrer',
};

export const ExternalLink = (props: TxtProps & ComponentProps<'a'>) => (
	<Txt tagName="a" {...externalLinkAttributes} {...props} />
);
