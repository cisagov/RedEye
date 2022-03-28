import { Connect16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import type { ComponentProps, FC } from 'react';
import { Txt } from '@redeye/ui-styles';
import { CarbonIcon } from '@redeye/client/components';
// import { Tokens } from '~/styles';

//  TODO add prop types information
export type BeaconSuggestedRowProps = ComponentProps<'div'> & {
	reason: string | null;
	targetHost: string;
	targetBeacon: string;
	// Add a prop to use in the command container with icon instead of command text
	icon: boolean;
};

// TODO: @Britt check if we are editing or adding new, and make sure does not show up if not clicked into a beacon
// if we are editing, fill in the field with existing created link
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

// TODO: Move to bottom of file.
const menuStyle = css`
	display: grid;
	grid-template-columns: max-content auto auto;
	/* grid-template-columns: 55% 30% 15%; */
	padding: 5px;
`;

const displayStyle = css`
	display: grid;
	/* grid-template-columns: 25px auto auto; */
	grid-template-columns: 10% 30% 15%;
	align-content: left;
	/* padding: 5px; */
`;
