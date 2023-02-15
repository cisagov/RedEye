import type { DialogProps } from '@blueprintjs/core';
import { Checkbox, Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import type { InfoType } from '@redeye/client/types';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';

type Props = DialogProps & {
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

		return (
			<Dialog
				onClose={onClose}
				title={last && !isHiddenToggled ? `Can Not Hide Final ${infoType}` : `${verb} This ${infoType}?`}
				{...props}
			>
				<div className={Classes.DIALOG_BODY}>
					{last && !isHiddenToggled ? (
						<>
							<Txt tagName="p">
								{plural} this {infoType} will create a state in which the UI has no content. To hide this {infoType}, you must
								unhide another {infoType}.
							</Txt>
							<Txt tagName="p">
								To unhide {infoType}s, toggle
								<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings, and go select
								<Txt bold> &quot;Show {infoType}&quot;</Txt> on one of he hidden {infoType}s.
							</Txt>
						</>
					) : (
						<>
							<Txt tagName="p">
								{plural} this {infoType} will make it {isHiddenToggled ? 'appear' : 'disappear from display'} in the UI.
							</Txt>
							{!isHiddenToggled && (
								<Txt tagName="p">
									{plural} this {infoType} will NOT delete it. Hidden {infoType}s can be shown again by toggling the
									<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings.
								</Txt>
							)}
							<Txt tagName="p">
								This will also {verb.toLowerCase()} descendants that are linked to this {infoType.toLowerCase()}
							</Txt>
							<Checkbox label="Don’t show this warning again" checked={checked} onChange={handleCheck} />
						</>
					)}
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button onClick={onClose}>Cancel</Button>
						<Button
							intent={Intent.PRIMARY}
							rightIcon={!last && isHiddenToggled && <CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
							loading={loading}
							onClick={
								last && !isHiddenToggled
									? onClose
									: (e) => {
											e.stopPropagation();
											setLoading(true);
											onHide();
									  }
							}
							css={buttonStyle}
						>
							{last && !isHiddenToggled ? 'OK' : `${verb} ${infoType}`}
						</Button>
					</div>
				</div>
			</Dialog>
		);
	}
);

const buttonStyle = css`
	min-width: 62.58px;
`;
