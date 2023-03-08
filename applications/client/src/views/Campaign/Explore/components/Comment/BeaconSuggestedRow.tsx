import { Connect16 } from '@carbon/icons-react';
// import { css } from '@emotion/react';
import type { ComponentProps, FC } from 'react';
import { Flex, Spacer, Txt } from '@redeye/ui-styles';
import { CarbonIcon } from '@redeye/client/components';

export type BeaconSuggestedRowProps = ComponentProps<'div'> & {
	// reason?: string | null;
	targetHost?: string | null;
	targetBeacon?: string | null;
	icon?: boolean;
};

export const BeaconSuggestedRow: FC<BeaconSuggestedRowProps> = ({
	targetHost,
	targetBeacon,
	// reason = '',
	icon = false,
}) =>
	!icon ? (
		<Flex>
			<Txt muted small>
				{targetHost}
			</Txt>
			<Spacer>/</Spacer>
			<Txt bold small>
				{targetBeacon}
			</Txt>
			{/* <Spacer /> */}
			{/* <Txt muted small>
				{reason}
			</Txt> */}
		</Flex>
	) : (
		<Flex>
			<CarbonIcon icon={Connect16} />
			<Spacer />
			<Txt muted small>
				{targetHost}
			</Txt>
			<Spacer>/</Spacer>
			<Txt bold small>
				{targetBeacon}
			</Txt>
		</Flex>
	);

// const menuStyle = css`
// 	/* display: grid;
// 	grid-template-columns: max-content auto auto; */
// 	/* padding: 5px; */
// `;

// const displayStyle = css`
// 	/* display: grid;
// 	grid-template-columns: 10% 30% 15%;
// 	align-content: left; */
// `;
