import type { DialogProps } from '@blueprintjs/core';
import { Button } from '@blueprintjs/core';
import { DialogEx, LoginForm } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { observer } from 'mobx-react-lite';
import type { FormEventHandler } from 'react';
import { DialogBodyEx } from './DialogBodyEx';

type UserSettingsOverlayProps = DialogProps & {
	onSubmit?: FormEventHandler<HTMLFormElement>;
};

export const UserSettingsOverlay = observer<UserSettingsOverlayProps>(({ onSubmit, ...props }) => {
	const store = useStore();
	return (
		<DialogEx title="User Settings" {...props}>
			<DialogBodyEx>
				<p>Change Username</p>
				<LoginForm submitText="Update" cy-test="update" onSubmit={onSubmit} />
				<Button minimal text="Log out" cy-test="logout" onClick={() => store.auth.logOut()} css={{ marginLeft: -7 }} />
			</DialogBodyEx>
		</DialogEx>
	);
});
