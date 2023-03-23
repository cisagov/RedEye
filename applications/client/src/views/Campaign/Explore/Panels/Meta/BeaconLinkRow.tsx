import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { CarbonIcon, semanticIcons } from '@redeye/client/components';
import type { LinkModel } from '@redeye/client/store';
import type { FlexProps } from '@redeye/ui-styles';
import { CoreTokens, Flex, FlexSplitter, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { NavBreadcrumbs } from '../../components';

export type BeaconLinkRowProps = FlexProps & {
	direction: 'To' | 'From';
	link: LinkModel;
};

export const BeaconLinkRow = observer<BeaconLinkRowProps>(({ direction, link, ...props }) => (
	<Flex gap={4} align="center" {...props}>
		<Flex gap={4} align="center" css={{ width: 60 }}>
			<CarbonIcon icon={direction === 'To' ? semanticIcons.linkTo : semanticIcons.linkFrom} />
			<Txt disabled>{direction}</Txt>
		</Flex>
		<NavBreadcrumbs
			muted
			hideServer
			beacon={direction === 'To' ? link.destination?.current : link.origin?.current}
			css={navBreadCrumbsStyle}
		/>
		<FlexSplitter />
		{link.command?.current && (
			<Txt muted>{link.command.current.inputText}</Txt>
			// : ( <Txt disabled italic>unknown</Txt> )}
		)}
	</Flex>
));

const navBreadCrumbsStyle = css`
	.${Classes.BREADCRUMB} {
		color: ${CoreTokens.TextBody} !important;
	}
`;
