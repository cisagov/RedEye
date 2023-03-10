import { Button, Intent } from '@blueprintjs/core';
import { DialogEx, DialogExProps } from '@redeye/client/components';
import { RedEyeRoutes, useStore } from '@redeye/client/store';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { DialogBodyEx } from './Dialogs/DialogBodyEx';
import { DialogFooterEx } from './Dialogs/DialogFooterEx';

type AuthCheckProps = Partial<DialogExProps> & {};

export const AuthCheck = observer<AuthCheckProps>(({ ...props }) => {
	const store = useStore();

	// Redirect to login if the app loads with no session/connection to the server
	useEffect(() => {
		setTimeout(() => {
			if (!store.appMeta.blueTeam) store.auth.checkServerConnection();
		}, 1000);
	}, []);

	const onClose = () => {
		store.auth.setPromptAuth(false);
		store.auth.setHasClickedAuthDialog(true);
	};

	const onLogin = () => {
		onClose();
		store.router.updateRoute({ path: RedEyeRoutes.LOGIN });
	};

	return (
		<DialogEx isOpen={store.auth.promptAuth} title="Unable to authenticate" onClose={onClose} {...props}>
			<DialogBodyEx>
				The application was unable to authenticate with the server. Click &quot;Login&quot; to re-authenticate.
			</DialogBodyEx>
			<DialogFooterEx
				actions={
					<>
						<Button onClick={onClose} text="Close" />
						<Button intent={Intent.PRIMARY} onClick={onLogin} text="Login" />
					</>
				}
			/>
		</DialogEx>
	);
});
