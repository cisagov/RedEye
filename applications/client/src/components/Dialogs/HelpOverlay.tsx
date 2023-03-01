import type { DrawerProps } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { Header, Spacer, Txt } from '@redeye/ui-styles';
import type { FC, ReactNode } from 'react';
import { Logo } from '../Header';
import { externalLinkAttributes as external } from '../utils';
import { DialogCustom } from './DialogCustom';

const appVersion = PACKAGE_VERSION;

type HelpOverlayProps = DrawerProps & {};

export const HelpOverlay: FC<HelpOverlayProps> = ({ ...props }) => (
	<DialogCustom css={layoutStyle} {...props}>
		<section cy-test="about-modal" css={{ padding: '1.5rem 3rem 2rem' }}>
			<Header cy-test="about-modal-header" large css={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
				<Logo cy-test="redeye-logo" css={{ height: '4rem', marginLeft: -16 }} />
				<Spacer />
				<Txt>
					RedEye{' '}
					<Txt monospace muted normal large>
						v{appVersion}
					</Txt>
				</Txt>
			</Header>

			<Txt cy-test="about-modal-description" tagName="p">
				RedEye is a red team C2 log visualization tool developed by <ExternalLink regular {...pnnlLink} /> for the{' '}
				<ExternalLink regular {...cisaLink} />.
			</Txt>

			<Txt cy-test="about-modal-links" tagName="p">
				<ExternalLink {...githubLink} />
				<Spacer>|</Spacer>
				<ExternalLink {...cobaltStrikeLink} />
			</Txt>

			<Txt cy-test="about-modal-copyright" tagName="p" muted small>
				Copyright {new Date().getFullYear()} PNNL &amp; CISA - <ExternalLink muted {...licenseLink} />
			</Txt>
		</section>
	</DialogCustom>
);

const layoutStyle = css`
	width: 650px;
	a {
		text-decoration: underline;
	}
	p {
		margin-bottom: 1rem;
		&:last-child {
			margin-bottom: 0;
		}
	}
`;

type LinkInfo = {
	href: string;
	children: ReactNode;
};
const githubLink: LinkInfo = {
	href: 'https://github.com/cisagov/redeye',
	children: 'Redeye GitHub Repo',
};
const licenseLink: LinkInfo = {
	href: `${githubLink.href}/blob/develop/LICENSE`,
	children: 'BSD-3 Licensed',
};
const cobaltStrikeLink: LinkInfo = {
	href: 'https://www.cobaltstrike.com',
	children: 'Cobalt Strike',
};
const pnnlLink: LinkInfo = {
	href: 'https://www.pnnl.gov/',
	children: 'Pacific Northwest National Laboratory',
};
const cisaLink: LinkInfo = {
	href: 'https://www.cisa.gov',
	children: 'CyberSecurity and Infrastructure Security Agency',
};

const ExternalLink = (props) => <Txt tagName="a" {...external} {...props} />;
