// import { Connect16 } from '@carbon/icons-react';
import type { ComponentProps, FC } from 'react';
// import { CarbonIcon } from '~/components';
import {
	// CommandModel,
	useStore,
} from '@redeye/client/store';

export type ShowAddedBeaconLinkProps = ComponentProps<'div'> & {
	// onClick: () => any;
	commandID?: string;
	// onSelectBeacon: (id) => any;
};

export const ShowAddedBeaconLink: FC<ShowAddedBeaconLinkProps> = ({
	// onClick,
	commandID,
}: // onSelectBeacon
ShowAddedBeaconLinkProps) => {
	if (commandID) {
		const store = useStore();
		// We need a list of all links? I think? And then we need to search for the commandID in
		//  the "source" or "from" beacons? NOTE: This doesn't differentiate between added beacon links and pre-existing.
		// const beacon = store.campaign.interactionState.selectedBeacon?.current;
		// const links = Array.from(store.graphqlStore.links.values());
		// const beacons = Array.from(store.graphqlStore.beacons.values() || []);

		//  how to generate list of linked beacons? Or list of from beacons with this command?? IDK
		// const connectedFromCommandsIDs = beacon?.links.from.flatMap((element) => element.command.id);

		// filter list of links?
		Array.from(store?.graphqlStore.links.values()).filter(
			(link) => link.command.id === commandID && link.manual === true
		);

		// console.log('Have found this link: ', JSON.stringify(createdLink[0]));
		return null;
	} else {
		return null;
	}
};
