import type { TxtProps } from '@redeye/ui-styles';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { BeaconModel } from '@redeye/client/store';
import { highlightPattern } from '@redeye/client/components';

export type BeaconSuggestedRowProps = TxtProps & {
	beaconModel: BeaconModel;
	query?: string;
};

export const BeaconSuggestedRow = observer<BeaconSuggestedRowProps>(({ beaconModel, query, ...props }) => (
	<Txt {...props}>{highlightPattern(beaconModel.computedNameWithHost, query)}</Txt>
));
