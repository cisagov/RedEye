import { Events, PanHorizontal, Ticket } from '@carbon/icons-react/next';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import { CoreTokens } from '@redeye/ui-styles';
import type { FC } from 'react';
import { MitreTechniques } from '../../../../store/graphql/MitreTechniquesEnum';

type MitreTechniqueIconsProps = {
	mitreAttackIds?: (string | null)[] | null;
};

const mitreIcons = {
	[MitreTechniques.LateralMovement]: PanHorizontal,
	[MitreTechniques.PrivilegeEscalation]: Events,
	[MitreTechniques.GoldenTicket]: () => (
		<Ticket
			cy-test="golden-ticket-icon"
			css={css`
				color: ${CoreTokens.Colors.Gold5};
			`}
		/>
	),
};

export const MitreTechniqueIcons: FC<MitreTechniqueIconsProps> = ({ mitreAttackIds }) => (
	<>
		{mitreAttackIds?.map((attackId) => {
			if (!attackId) return null;
			const Icon = mitreIcons[attackId];
			if (Icon) return <CarbonIcon cy-test={attackId} key={attackId} icon={Icon} />;
			return null;
		})}
	</>
);
