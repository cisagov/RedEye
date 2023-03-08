import { Connect16 } from '@carbon/icons-react';
// import { css } from '@emotion/react';
import type { ComponentProps, FC } from 'react';
import { Spacer, Txt } from '@redeye/ui-styles';
import { CarbonIcon } from '@redeye/client/components';

export type BeaconSuggestedRowProps = ComponentProps<'div'> & {
	targetHost?: string | null;
	targetBeacon?: string | null;
	icon?: boolean;
};

export const BeaconSuggestedRow: FC<BeaconSuggestedRowProps> = ({ targetHost, targetBeacon, icon = false }) =>
	!icon ? (
		<Txt>
			<Txt>{targetHost}</Txt>
			<Spacer>/</Spacer>
			<Txt bold>{targetBeacon}</Txt>
		</Txt>
	) : (
		<Txt>
			<CarbonIcon icon={Connect16} />
			<Spacer />
			<Txt>{targetHost}</Txt>
			<Spacer>/</Spacer>
			<Txt bold>{targetBeacon}</Txt>
		</Txt>
	);
