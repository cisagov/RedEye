import { Checkbox, Button, Intent } from '@blueprintjs/core';
import { View16, ViewOff16 } from '@carbon/icons-react';
import type { DialogExProps } from '@redeye/client/components';
import { CarbonIcon, DialogBodyEx, DialogEx, DialogFooterEx } from '@redeye/client/components';
import type { InfoType } from '@redeye/client/types';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';

type Props = DialogExProps & {
	typeName: string;
	infoType: InfoType;
	onHide?: () => void;
	isHiddenToggled?: boolean;
	last?: boolean;
};

export const ToggleHiddenDialog = observer<Props>(
	({ typeName, infoType, onClose, isHiddenToggled = true, onHide = () => undefined, last, ...props }) => {
		const [loading, setLoading] = useState(false);
		const [checked, setChecked] = useState(window.localStorage.getItem('disableDialog') === 'true');
		const plural = isHiddenToggled ? 'Showing' : 'Hiding';
		const verb = isHiddenToggled ? 'Show' : 'Hide';

		const handleCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
			setChecked(e.target.checked);
			window.localStorage.setItem('disableDialog', e.target.checked.toString());
		}, []);

		const confirmShowHide =
			last && !isHiddenToggled
				? onClose
				: (e: React.SyntheticEvent) => {
						e.stopPropagation();
						setLoading(true);
						onHide();
				  };

		const dialogTitle =
			last && !isHiddenToggled
				? `Cannot hide final ${infoType.toLowerCase()}`
				: `${verb} this ${infoType.toLowerCase()}?`;

		return (
			<DialogEx onClose={onClose} title={dialogTitle} {...props}>
				<DialogBodyEx cy-test="show-hide-dialog-text">
					{last && !isHiddenToggled ? (
						<>
							<Txt tagName="p">
								{plural} this {infoType.toLowerCase()} will create a state in which the UI has no content. To hide this{' '}
								{infoType}, you must unhide another {infoType.toLowerCase()}.
							</Txt>
							<Txt tagName="p">
								To unhide {infoType.toLowerCase()}s, toggle
								<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings, and go
								select
								<Txt bold> &quot;Show {infoType}&quot;</Txt> on one of the hidden {infoType.toLowerCase()}s.
							</Txt>
						</>
					) : (
						<>
							<Txt cy-test="dialog-text-line1" tagName="p">
								{plural} this {infoType.toLowerCase()} will make it{' '}
								{isHiddenToggled ? 'appear' : 'disappear from display'} in the UI.
							</Txt>
							{!isHiddenToggled && (
								<Txt cy-test="dialog-text-line2" tagName="p">
									{plural} this {infoType.toLowerCase()} will NOT delete it. Hidden {infoType.toLowerCase()}s can be
									shown again by toggling the
									<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings.
								</Txt>
							)}
							<Txt cy-test="dialog-text-line3" tagName="p">
								This will also {verb.toLowerCase()} descendants that are linked to this {infoType.toLowerCase()}.
							</Txt>
							<Checkbox label="Don’t show this warning again" checked={checked} onChange={handleCheck} />
						</>
					)}
				</DialogBodyEx>
				<DialogFooterEx
					actions={
						<>
							<Button cy-test="cancel-show-hide" onClick={onClose} text="Cancel" />
							<Button
								cy-test="confirm-show-hide"
								intent={Intent.PRIMARY}
								rightIcon={!last && <CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
								loading={loading}
								text={last && !isHiddenToggled ? 'OK' : `${verb} ${infoType}`}
								onClick={confirmShowHide}
								alignText="left"
							/>
						</>
					}
				/>
			</DialogEx>
		);
	}
);
