import { Connect16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { ComponentProps, FC } from 'react';
import { Txt } from '@redeye/ui-styles';
import { CarbonIcon } from '@redeye/client/components';

export type BeaconSuggestedRowProps = ComponentProps<'div'> & {
	reason: string | null;
	targetHost?: string | null;
	targetBeacon?: string | null;
	icon: boolean;
};

export const BeaconSuggestedRow: FC<BeaconSuggestedRowProps> = ({
	targetHost,
	targetBeacon,
	reason = '',
	icon = false,
}) =>
	!icon ? (
		<div css={menuStyle}>
			<Txt muted small text-align="right">
				{' '}
				{targetHost} &ensp;/ &ensp;{' '}
			</Txt>

			<Txt bold small align-items="center">
				{' '}
				{targetBeacon}{' '}
			</Txt>

			<Txt muted small align-items="right">
				{' '}
				&ensp; {reason}{' '}
			</Txt>
		</div>
	) : (
		<div css={displayStyle}>
			<CarbonIcon icon={Connect16} />

			<Txt small text-align="right">
				{' '}
				{targetHost} &ensp;/ &ensp;{' '}
			</Txt>

			<Txt small align-items="center">
				{' '}
				{targetBeacon}{' '}
			</Txt>
		</div>
	);

const menuStyle = css`
	display: grid;
	grid-template-columns: max-content auto auto;
	padding: 5px;
`;

const displayStyle = css`
	display: grid;
	grid-template-columns: 10% 30% 15%;
	align-content: left;
`;
