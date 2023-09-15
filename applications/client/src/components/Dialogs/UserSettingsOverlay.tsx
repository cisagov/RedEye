import { Button } from '@blueprintjs/core';
import type { DialogExProps } from '@redeye/client/components';
import { DialogBodyEx, DialogEx, DialogFooterEx } from '@redeye/client/components';
import { useStore } from '@redeye/client/store';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { FormEventHandler } from 'react';

type UserSettingsOverlayProps = DialogExProps & {
	onSubmit?: FormEventHandler<HTMLFormElement>;
};

export const UserSettingsOverlay = observer<UserSettingsOverlayProps>(({ onSubmit, onClose, ...props }) => {
	const store = useStore();
	return (
		<DialogEx title="User" onClose={onClose} {...props}>
			<DialogBodyEx>
				<Txt>Logged in as {store.auth.userName}</Txt>
			</DialogBodyEx>
			<DialogFooterEx
				actions={
					<>
						<Button text="Close" onClick={onClose} />
						<Button
							intent="warning"
							text="Log out"
							cy-test="logout"
							onClick={() => store.auth.logOut()}
							css={{ marginLeft: -7 }}
						/>
					</>
				}
			/>
		</DialogEx>
	);
});
