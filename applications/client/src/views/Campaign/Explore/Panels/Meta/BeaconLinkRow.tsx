import { css } from '@emotion/react';
import { FlexSplitter, Spacer, Txt } from '@redeye/ui-styles';
import type { ComponentProps, FC } from 'react';
import { InfoRow } from '../../components';

export type BeaconLinkRowProps = ComponentProps<'div'> & {
	direction?: string | null;
	host?: string | null;
	beacon?: string | null;
	command?: string | null;
};

export const BeaconLinkRow: FC<BeaconLinkRowProps> = ({ direction, host, beacon, command, ...props }) => (
	<InfoRow css={wrapperStyle} {...props}>
		<Txt disabled css={directionStyle}>
			{direction}
		</Txt>
		<Txt ellipsize>
			<Txt>{host}</Txt>
			<Spacer>/</Spacer>
			<Txt>{beacon}</Txt>
		</Txt>
		<FlexSplitter />
		<Txt muted>{command}</Txt>
	</InfoRow>
);

const wrapperStyle = css`
	display: flex;
	padding: 0 0.25rem;
	margin-left: -0.25rem;
	height: auto;
`;

const directionStyle = css`
	min-width: 6ch;
	margin-right: 5px;
`;
