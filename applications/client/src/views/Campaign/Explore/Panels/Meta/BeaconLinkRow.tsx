import { Classes } from '@blueprintjs/core';
import { css } from '@emotion/react';
import { CarbonIcon, semanticIcons } from '@redeye/client/components';
import type { LinkModel } from '@redeye/client/store';
import { CoreTokens, Flex, FlexSplitter, Txt } from '@redeye/ui-styles';
import type { FlexProps } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { NavBreadcrumbs } from '../../components';

export type BeaconLinkRowProps = FlexProps & {
	direction: 'To' | 'From';
	link: LinkModel;
};

export const BeaconLinkRow = observer<BeaconLinkRowProps>(({ direction, link, ...props }) => (
	<Flex gap={8} align="center" {...props}>
		<Flex gap={4} align="center" css={{ flexBasis: 60, color: CoreTokens.TextMuted }}>
			<CarbonIcon icon={direction === 'To' ? semanticIcons.linkTo : semanticIcons.linkFrom} />
			<Txt>{direction}</Txt>
		</Flex>
		<NavBreadcrumbs
			muted
			hideServer
			beacon={direction === 'To' ? link.destination?.current : link.origin?.current}
			css={navBreadCrumbsStyle}
		/>
		{/* <Spacer>/</Spacer> */}
		{link.command?.current ? (
			<Txt muted>{link.command.current.inputText}</Txt>
		) : (
			<Txt disabled italic>
				unknown
			</Txt>
		)}
		<FlexSplitter />
		{/* TODO: comment related to link...
			<HeroButton children={<CarbonIcon cy-test="add-comment" icon={semanticIcons.comment} />} /> 
		*/}
	</Flex>
));

const navBreadCrumbsStyle = css`
	.${Classes.BREADCRUMB} {
		color: ${CoreTokens.TextBody} !important;
	}
`;
