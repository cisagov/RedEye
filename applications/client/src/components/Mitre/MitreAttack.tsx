import { observer } from 'mobx-react-lite';
import type { ComponentProps } from 'react';
import { mitreAttackDictionary } from './mitreAttackDictionary';

type MitreAttackItem = {
	name: string;
	id: string;
	url: string;
};
export type MitreAttackId = keyof typeof mitreAttackDictionary;
// type MitreAttackDictionary = Record<keyof typeof mitreAttackDictionary, MitreAttackItem>;

type MitreAttackProps = ComponentProps<'a'> & {
	miterAttackId: keyof typeof mitreAttackDictionary;
};

export const MitreAttack = observer<MitreAttackProps>(({ miterAttackId, ...props }) => {
	const { name, id, url } = mitreAttackDictionary[miterAttackId] as MitreAttackItem;
	return (
		<a
			children={`${id}: ${name}`}
			aria-label="Mitre attack links"
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			{...props}
		/>
	);
});
