import { Connect16 } from '@carbon/icons-react';
import type { ComponentProps, FC } from 'react';
import { CarbonIcon } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { BeaconSuggestedRow } from '.';

export type CheckForAddedLinkProps = ComponentProps<'div'> & {
	commandID?: string;
	containerOrBox: string;
	toggleLinkedFlag: (linkedFlag, linkedLink) => any;
};

export const CheckForAddedLink: FC<CheckForAddedLinkProps> = ({
	commandID,
	containerOrBox,
	toggleLinkedFlag,
}: CheckForAddedLinkProps) => {
	const store = useStore();

	const linkedModel = Array.from(store?.graphqlStore.links.values())
		.filter((link) => link.manual === true)
		.filter((link) => link.command?.id && link.command.id === commandID);

	if (linkedModel && linkedModel.length > 0) {
		if (containerOrBox === 'container') {
			return <CarbonIcon icon={Connect16} />;
		} else if (containerOrBox === 'box') {
			toggleLinkedFlag(true, linkedModel[0]);
			return (
				<BeaconSuggestedRow
					reason=""
					targetHost={linkedModel[0].destination?.current.host?.current.displayName}
					targetBeacon={linkedModel[0].destination?.current.displayName}
					icon
				/>
			);
		} else {
			toggleLinkedFlag(false, null);
		}
	}
	return null;
};
