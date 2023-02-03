import type { DialogProps } from '@blueprintjs/core';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { View16, ViewOff16 } from '@carbon/icons-react';
import { CarbonIcon } from '@redeye/client/components';
import type { InfoType } from '@redeye/client/types';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

type Props = DialogProps & {
	infoType: InfoType;
	onHide?: () => void;
	isHiddenToggled?: boolean;
};

export const ToggleHiddenDialog = observer<Props>(
	({ infoType, onClose, isHiddenToggled = true, onHide = () => undefined, ...props }) => {
		const [loading, setLoading] = useState(false);
		const plural = isHiddenToggled ? 'Showing' : 'Hiding';
		const verb = isHiddenToggled ? 'Show' : 'Hide';
		return (
			<Dialog onClose={onClose} title={`${verb} This ${infoType}?`} {...props}>
				<div className={Classes.DIALOG_BODY}>
					<Txt tagName="p">
						{plural} this {infoType} will make it {isHiddenToggled ? 'appear' : 'disappear from display'} in the UI.
					</Txt>
					{!isHiddenToggled && (
						<Txt tagName="p">
							{plural} this {infoType} will NOT delete it. Hidden {infoType}s can be shown again by toggling the
							<Txt bold>&quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings.
						</Txt>
					)}
					<Txt tagName="p">
						This will also {verb.toLowerCase()} descendants that are linked to this {infoType.toLowerCase()}
					</Txt>
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button onClick={onClose}>Cancel</Button>
						<Button
							intent={Intent.PRIMARY}
							rightIcon={<CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
							loading={loading}
							onClick={(e) => {
								e.stopPropagation();
								setLoading(true);
								onHide();
							}}
						>
							{verb} {infoType}
						</Button>
					</div>
				</div>
			</Dialog>
		);
	}
);
