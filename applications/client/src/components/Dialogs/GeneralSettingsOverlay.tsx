import type { DialogExProps } from '@redeye/client/components';
import { DialogEx, SettingsForm } from '@redeye/client/components';
import type { FC } from 'react';

type GeneralSettingsOverlayProps = DialogExProps & {};

export const GeneralSettingsOverlay: FC<GeneralSettingsOverlayProps> = ({ ...props }) => (
	<DialogEx title="General Settings" {...props}>
		<SettingsForm css={{ padding: '1rem' }} />
	</DialogEx>
);
