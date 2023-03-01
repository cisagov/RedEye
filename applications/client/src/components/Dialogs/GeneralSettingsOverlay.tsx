import type { DialogProps } from '@blueprintjs/core';
import { DialogCustom, SettingsForm } from '@redeye/client/components';
import type { FC } from 'react';

type GeneralSettingsOverlayProps = DialogProps & {};

export const GeneralSettingsOverlay: FC<GeneralSettingsOverlayProps> = ({ ...props }) => (
	<DialogCustom title="General Settings" {...props}>
		<SettingsForm css={{ padding: '1rem' }} />
	</DialogCustom>
);
