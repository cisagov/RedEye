import type { DialogProps } from '@blueprintjs/core';
import { DialogBody, DialogFooter, Button, Intent } from '@blueprintjs/core';
import { WarningAlt16 } from '@carbon/icons-react';
import { CarbonIcon, DialogCustom } from '@redeye/client/components';
import { RedEyeRoutes, useStore } from '@redeye/client/store';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

type AuthCheckProps = Partial<DialogProps> & {};

export const AuthCheck = observer<AuthCheckProps>(({ ...props }) => {
	const store = useStore();
	// Redirect to login if the app loads with no session/connection to the server
	useEffect(() => {
		setTimeout(() => {
			if (!store.appMeta.blueTeam) store.auth.checkServerConnection();
		}, 1000);
	}, []);
	const close = () => {
		store.auth.setPromptAuth(false);
		store.auth.setHasClickedAuthDialog(true);
	};

	return (
		<DialogCustom
			isOpen={store.auth.promptAuth}
			icon={<CarbonIcon icon={WarningAlt16} />}
			title="Unable to authenticate"
			onClose={close}
			{...props}
		>
			<DialogBody>
				The application was unable to authenticate with the server. Click &quot;Login&quot; to re-authenticate.
			</DialogBody>
			<DialogFooter
				actions={
					<>
						<Button
							onClick={() => {
								close();
							}}
							text="Close"
						/>
						<Button
							intent={Intent.PRIMARY}
							onClick={() => {
								close();
								store.router.updateRoute({ path: RedEyeRoutes.LOGIN });
							}}
							text="Login"
						/>
					</>
				}
			/>
		</DialogCustom>
	);
});