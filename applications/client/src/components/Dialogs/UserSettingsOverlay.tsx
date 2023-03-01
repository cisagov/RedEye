import type { DialogProps } from '@blueprintjs/core';
import { DialogBody, Button, Dialog } from '@blueprintjs/core';
import { LoginForm } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { observer } from 'mobx-react-lite';
import type { FormEventHandler } from 'react';

type UserSettingsOverlayProps = DialogProps & {
	onSubmit?: FormEventHandler<HTMLFormElement>;
};

export const UserSettingsOverlay = observer<UserSettingsOverlayProps>(({ onSubmit, ...props }) => {
	const store = useStore();
	return (
		<Dialog title="User Settings" {...props}>
			<DialogBody>
				<p>Change Username</p>
				<LoginForm submitText="Update" cy-test="update" onSubmit={onSubmit} />
				<Button minimal text="Log out" cy-test="logout" onClick={() => store.auth.logOut()} css={{ marginLeft: -7 }} />
			</DialogBody>
		</Dialog>
	);
});
