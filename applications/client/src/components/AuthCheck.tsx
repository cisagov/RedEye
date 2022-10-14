import type { DialogProps } from '@blueprintjs/core';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { WarningAlt16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
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
		<Dialog
			isOpen={store.auth.promptAuth}
			icon={<CarbonIcon icon={WarningAlt16} />}
			title="Unable to authenticate"
			onClose={close}
			{...props}
		>
			<div className={Classes.DIALOG_BODY}>
				The application was unable to authenticate with the server. Click &quot;Login&quot; to re-authenticate.
			</div>
			<div className={Classes.DIALOG_FOOTER} css={footerStyles}>
				<Button
					onClick={() => {
						close();
					}}
				>
					Close
				</Button>
				<Button
					intent={Intent.PRIMARY}
					onClick={() => {
						close();
						store.router.updateRoute({ path: RedEyeRoutes.LOGIN });
					}}
				>
					Login
				</Button>
			</div>
		</Dialog>
	);
});

const footerStyles = css`
	display: flex;
	flex-direction: row;
	justify-content: end;

	& .${Classes.BUTTON} {
		margin-left: 10px;
	}
`;
