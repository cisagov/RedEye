import type { ComponentProps, FC } from 'react';
import { useStore } from '@redeye/client/store';

export type ShowAddedBeaconLinkProps = ComponentProps<'div'> & {
	commandID?: string;
};

export const ShowAddedBeaconLink: FC<ShowAddedBeaconLinkProps> = ({ commandID }: ShowAddedBeaconLinkProps) => {
	if (commandID) {
		const store = useStore();

		// filter list of links
		Array.from(store?.graphqlStore.links.values()).filter(
			(link) => link.command.id === commandID && link.manual === true
		);
		return null;
	} else {
		return null;
	}
};
