import type { ButtonGroupProps } from '@blueprintjs/core';
import { Button, ButtonGroup, AnchorButton } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { Help16, Help24, Settings16, Settings24, User16, User24 } from '@carbon/icons-react';
import {
	CarbonIcon,
	GeneralSettingsOverlay,
	HelpOverlay,
	NavButton,
	UserSettingsOverlay,
} from '@redeye/client/components';
import type { AppStore } from '@redeye/client/store';
import { useStore } from '@redeye/client/store';
import { observer } from 'mobx-react-lite';
import { css } from '@emotion/react';
import type { UseCreateState } from '../mobx-create-state';
import { createState } from '../mobx-create-state';

type SettingsOverlayState = {
	isUserSettingsOpen: boolean;
	isHelpPanelOpen: boolean;
	isGeneralSettingsOpen: boolean;
};

type AppOptionsProps = Omit<ButtonGroupProps, 'children'> & {
	condensed?: boolean;
	navBar?: boolean;
};

export const AppOptions = observer<AppOptionsProps>(({ condensed = false, navBar, ...props }) => {
	const state = createState<SettingsOverlayState>({
		isUserSettingsOpen: false,
		isHelpPanelOpen: false,
		isGeneralSettingsOpen: false,
	});

	const store = useStore();
	return (
		<>
			{navBar ? (
				<NavBarOptions state={state} />
			) : (
				<HeaderOptions state={state} store={store} condensed={condensed} {...props} />
			)}
			<UserSettingsOverlay
				isOpen={state.isUserSettingsOpen}
				onClose={() => {
					state.update('isUserSettingsOpen', false);
				}}
				onSubmit={() => {
					state.update('isUserSettingsOpen', false);
				}}
			/>
			<GeneralSettingsOverlay
				isOpen={state.isGeneralSettingsOpen}
				onClose={() => {
					state.update('isGeneralSettingsOpen', false);
				}}
			/>
			<HelpOverlay
				isOpen={state.isHelpPanelOpen}
				onClose={() => {
					state.update('isHelpPanelOpen', false);
				}}
			/>
		</>
	);
});

const HeaderOptions = ({
	state,
	store,
	condensed,
	...props
}: {
	state: UseCreateState<SettingsOverlayState>;
	store: AppStore;
	condensed: boolean;
}) => (
	<ButtonGroup {...props} minimal>
		<Button
			cy-test="user"
			text={store.auth.userName}
			onClick={() => {
				state.update('isUserSettingsOpen', true);
			}}
			rightIcon={<CarbonIcon icon={User16} />}
		/>
		<Button
			cy-test="settings"
			text={condensed ? undefined : 'Settings'}
			onClick={() => {
				state.update('isGeneralSettingsOpen', true);
			}}
			rightIcon={<CarbonIcon icon={Settings16} />}
		/>
		<Button
			cy-test="help"
			text={condensed ? undefined : 'Help'}
			onClick={() => {
				state.update('isHelpPanelOpen', true);
			}}
			rightIcon={<CarbonIcon icon={Help16} />}
		/>
	</ButtonGroup>
);

const NavBarOptions = ({ state }: { state: UseCreateState<SettingsOverlayState> }) => {
	const store = useStore();
	const isRedTeam = !store.appMeta.blueTeam;

	return (
		<>
			<NavButton
				cy-test="user-settings"
				icon={<CarbonIcon icon={User24} />}
				title="User Settings"
				onClick={() => {
					state.update('isUserSettingsOpen', true);
				}}
				active={state.isUserSettingsOpen}
			/>
			<NavButton
				cy-test="general-settings"
				icon={<CarbonIcon icon={Settings24} />}
				title="General Settings"
				onClick={() => {
					state.update('isGeneralSettingsOpen', true);
				}}
				active={state.isGeneralSettingsOpen}
			/>
			<NavButton
				cy-test="help-btn"
				icon={<CarbonIcon icon={Help24} />}
				title="Help"
				onClick={() => {
					state.update('isHelpPanelOpen', true);
				}}
				active={state.isHelpPanelOpen}
			/>
			<div css={dividerStyle} />
			<div css={dividerStyle2} />
			{isRedTeam ? (
				<Popover2
					position="right"
					autoFocus={false}
					interactionKind="hover"
					content={
						<div css={hoverInfoStyle}>
							<b>Blue Team </b> Mode <br />
							<hr style={{ height: '3px', visibility: 'hidden' }} />
							Restricted RedEye functionality. Editing and commenting features are not available.
						</div>
					}
				>
					<AnchorButton intent="primary" small>
						BT
					</AnchorButton>
				</Popover2>
			) : (
				<Popover2
					position="right"
					autoFocus={false}
					interactionKind="hover"
					content={
						<div css={hoverInfoStyle}>
							<b>Red Team </b> Mode <br />
							<hr style={{ height: '3px', visibility: 'hidden' }} />
							Full RedEye functionality. Editing and commenting is not restricted.
						</div>
					}
				>
					<AnchorButton intent="danger" small>
						RT
					</AnchorButton>
				</Popover2>
			)}
		</>
	);
};

const dividerStyle = css`
	width: 15px;
	height: 1px;
	align-content: top;
	padding-bottom: 1px;
	background-color: grey;
`;

const dividerStyle2 = css`
	width: 15px;
	height: 1px;
	align-content: top;
	padding-bottom: 10px;
	/* background-color: black; */
`;

const hoverInfoStyle = css`
	padding: 15px;
	width: 24em;
`;
