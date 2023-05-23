import type { TxtProps } from '@redeye/ui-styles';
import { Spacer, Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { BeaconModel } from '@redeye/client/store';
import { highlightPattern } from '@redeye/client/components';

export type BeaconSuggestedRowProps = TxtProps & {
	beaconModel: BeaconModel;
	query?: string;
};

export const BeaconSuggestedRow = observer<BeaconSuggestedRowProps>(({ beaconModel, query, ...props }) => {
	const hostName = beaconModel.host?.current.displayName || '';
	const beaconName = beaconModel.displayName || '';
	const beaconContextName = beaconModel.meta?.[0]?.maybeCurrent?.username || '';

	return (
		<Txt {...props}>
			<Txt>{highlightPattern(hostName, query)}</Txt>
			<Spacer>/</Spacer>
			<Txt bold>{highlightPattern(beaconName, query)}</Txt>
			<Spacer />
			<Txt>{highlightPattern(beaconContextName, query)}</Txt>
		</Txt>
	);
});
