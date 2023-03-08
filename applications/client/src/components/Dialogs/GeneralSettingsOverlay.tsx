import type { DialogProps } from '@blueprintjs/core';
import { DialogEx, SettingsForm } from '@redeye/client/components';
import type { FC } from 'react';

type GeneralSettingsOverlayProps = DialogProps & {};

export const GeneralSettingsOverlay: FC<GeneralSettingsOverlayProps> = ({ ...props }) => (
	<DialogEx title="General Settings" {...props}>
		<SettingsForm css={{ padding: '1rem' }} />
	</DialogEx>
);
