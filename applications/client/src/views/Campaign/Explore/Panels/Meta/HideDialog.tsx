import type { DialogProps } from '@blueprintjs/core';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon, isDefined } from '@redeye/client/components';
import type { BeaconModel, HostModel } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import type { InfoType } from '@redeye/client/types';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useState } from 'react';

type Props = DialogProps & {
	typeName: string;
	infoType: InfoType;
	onHide?: () => void;
	isHiddenToggled?: boolean;
	setLast?: Dispatch<SetStateAction<boolean>>;
};

export const ToggleHiddenDialog = observer<Props>(
	({ typeName, infoType, onClose, isHiddenToggled = true, onHide = () => undefined, setLast, ...props }) => {
		const store = useStore();
		const [loading, setLoading] = useState(false);
		const plural = isHiddenToggled ? 'Showing' : 'Hiding';
		const verb = isHiddenToggled ? 'Show' : 'Hide';
		// console.log('hide? ', count);

		const totalServerCount = store.graphqlStore.campaigns.get(store.router.params?.id as string)?.serverCount;
		const totalBeaconCount = store.graphqlStore.campaigns.get(store.router.params?.id as string)?.beaconCount;

		const unhiddenServerCount = Array.from(store.graphqlStore?.hosts.values() || [])
			?.filter<HostModel>(isDefined)
			.filter((host) => host.cobaltStrikeServer)
			.filter((host) => !host.hidden).length;

		const unhiddenHostCount = Array.from(store.graphqlStore?.hosts.values() || [])
			?.filter<HostModel>(isDefined)
			.filter((host) => !host.cobaltStrikeServer)
			.filter((host) => !host.hidden).length;

		const unhiddenBeaconCount = Array.from(store.graphqlStore?.beacons.values() || [])
			?.filter((b) => b?.host?.current?.cobaltStrikeServer === false)
			?.filter<BeaconModel>(isDefined)
			.filter((b) => !b.hidden).length;

		const last =
			typeName === 'server'
				? unhiddenServerCount === 1
				: typeName === 'host'
				? unhiddenHostCount === 1
				: typeName === 'beacon'
				? unhiddenBeaconCount === 1
				: false;

		console.log(
			'beacon: ',
			totalServerCount,
			totalBeaconCount,
			unhiddenServerCount,
			unhiddenHostCount,
			unhiddenBeaconCount,
			typeName,
			last
		);

		const count = unhiddenBeaconCount;

		useEffect(() => {
			if (setLast) setLast(last);
		}, [last, setLast]);

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
						</>
					)}
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button onClick={onClose}>Cancel</Button>
						<Button
							intent={Intent.PRIMARY}
							rightIcon={count !== 1 && isHiddenToggled && <CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
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
