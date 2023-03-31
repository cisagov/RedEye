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
	cantHideEntities?: boolean;
	bulk?: boolean;
};

export const ToggleHiddenDialog = observer<Props>(
	({
		typeName,
		infoType,
		onClose,
		isHiddenToggled = true,
		onHide = () => undefined,
		cantHideEntities,
		bulk = false,
		...props
	}) => {
		const [loading, setLoading] = useState(false);
		const [checked, setChecked] = useState(window.localStorage.getItem('disableDialog') === 'true');
		const plural = isHiddenToggled ? 'Showing' : 'Hiding';
		const verb = isHiddenToggled ? 'Show' : 'Hide';

		const handleCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
			setChecked(e.target.checked);
			window.localStorage.setItem('disableDialog', e.target.checked.toString());
		}, []);

		const isHidingFinal = cantHideEntities && !isHiddenToggled;

		const confirmShowHide = isHidingFinal
			? onClose
			: (e: React.SyntheticEvent) => {
					e.stopPropagation();
					setLoading(true);
					onHide();
			  };

		const dialogTitle = isHidingFinal
			? `Cannot hide final ${infoType.toLowerCase()}`
			: // : `${verb} this ${infoType.toLowerCase()}?`;
				  `${verb} ${bulk ? 'these' : 'this'} ${infoType.toLowerCase()}${bulk ? 's' : ''}?`;

		return (
			<DialogEx onClose={onClose} title={dialogTitle} {...props}>
				<DialogBodyEx cy-test="show-hide-dialog-text">
					{isHidingFinal ? (
						<>
							<Txt cy-test="cannot-hide-final-text1" running>
								{plural} this {infoType.toLowerCase()} will create a state in which the UI has no content. To hide this{' '}
								{infoType}, you must unhide another {infoType.toLowerCase()}.
							</Txt>
							<Txt cy-test="cannot-hide-final-text2" running>
								To unhide {infoType.toLowerCase()}s, toggle
								<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings, and go
								select
								<Txt bold> &quot;Show {infoType}&quot;</Txt> on one of the hidden {infoType.toLowerCase()}s.
							</Txt>
						</>
					) : (
						<>
							<Txt cy-test="dialog-text-line1" running>
								{`${plural} ${bulk ? 'these' : 'this'} ${infoType.toLowerCase()}${bulk ? 's' : ''} will make ${
									bulk ? 'them' : 'it'
								} ${isHiddenToggled ? 'appear' : 'disappear from display'} in the UI.`}
							</Txt>
							{!isHiddenToggled && (
								<Txt cy-test="dialog-text-line2" running>
									{`${plural} ${bulk ? 'these' : 'this'} ${infoType.toLowerCase()}${bulk ? 's' : ''} will NOT delete ${
										bulk ? 'them' : 'it'
									}. Hidden ${infoType.toLowerCase()}s can be shown again by toggling the`}
									<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings.
								</Txt>
							)}
							<Txt cy-test="dialog-text-line3" running>
								{`This will also ${verb.toLowerCase()} descendants that are linked to ${bulk ? 'these' : 'this'}
								${infoType.toLowerCase()}${bulk ? 's' : ''}.`}
							</Txt>
							<Checkbox label="Don't show this warning again" checked={checked} onChange={handleCheck} />
						</>
					)}
				</DialogBodyEx>
				<DialogFooterEx
					actions={
						<>
							{!isHidingFinal && <Button cy-test="cancel-show-hide" onClick={onClose} text="Cancel" />}
							<Button
								cy-test="confirm-show-hide"
								intent={Intent.PRIMARY}
								rightIcon={!cantHideEntities && <CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
								loading={loading}
								text={isHidingFinal ? 'Cancel' : `${verb} ${infoType}${bulk ? 's' : ''}`}
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
